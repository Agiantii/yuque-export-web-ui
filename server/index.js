const express = require('express');
const cors = require('cors');
const axios = require('axios');
const JSZip = require('jszip');

const app = express();
const PORT = 7000;

// 详细的日志中间件
app.use((req, res, next) => {
  console.log('\n--- Incoming Request ---');
  console.log(`Time: ${new Date().toISOString()}`);
  console.log(`Method: ${req.method}`);
  console.log(`URL: ${req.url}`);
  console.log('Body:', req.body);
  console.log('----------------------\n');
  next();
});

// 允许前端访问
app.use(cors({
  origin: function(origin, callback) {
    // // 允许本地开发环境的请求
    // if (!origin || origin.startsWith('http://localhost:')) {
    //   callback(null, true);
    // } else {
    //   callback(new Error('Not allowed by CORS'));
    // }
    callback(null,true)
  },
  credentials: true
}));

app.use(express.json());

const yuqueHeaders = {
  'Referer': 'https://www.yuque.com',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
};

// 测试路由
app.get("/api/test", (req, res) => {
  console.log("Test endpoint hit");
  res.json({
    test: "test",
    time: new Date().toISOString()
  });
});

// 获取书籍列表
app.post('/api/books', async (req, res) => {
  console.log('\n=== Books Request ===');
  const { cookie } = req.body;
  console.log('Received cookie from body:', cookie);
  
  try {
    const response = await axios.get('https://www.yuque.com/api/mine/book_stacks', {
      headers: {
        ...yuqueHeaders,
        Cookie: cookie
      }
    });
    
    console.log('Yuque API response:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching books:', error.response?.data || error.message);
    res.status(500).json({ error: error.message });
  }
});

// 获取文档列表
app.post('/api/docs', async (req, res) => {
  try {
    const { cookie, bookId } = req.body;
    const response = await axios.get(`https://www.yuque.com/api/docs?book_id=${bookId}`, {
      headers: {
        ...yuqueHeaders,
        Cookie: cookie
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching docs:', error.response?.data || error.message);
    res.status(500).json({ error: error.message });
  }
});

// 获取目录结构
app.post('/api/catalog', async (req, res) => {
  try {
    const { cookie, bookId } = req.body;
    const response = await axios.get(`https://www.yuque.com/api/catalog_nodes?book_id=${bookId}`, {
      headers: {
        ...yuqueHeaders,
        Cookie: cookie
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching catalog:', error.response?.data || error.message);
    res.status(500).json({ error: error.message });
  }
});

// 获取文档内容
app.post('/api/doc/content', async (req, res) => {
  try {
    const { cookie, docId } = req.body;
    const response = await axios.get(
      `https://www.yuque.com/api/docs/${docId}/markdown?attachment=true&latexcode=true&anchor=false&linebreak=false`,
      {
        headers: {
          ...yuqueHeaders,
          Cookie: cookie
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching doc content:', error.response?.data || error.message);
    res.status(500).json({ error: error.message });
  }
});

// 获取用户登录名
async function getLoginName(cookie) {
  try {
    const response = await axios.get('https://www.yuque.com/api/mine/book_stacks', {
      headers: {
        ...yuqueHeaders,
        Cookie: cookie
      }
    });
    
    const bookStack = response.data;
    const loginName = bookStack.data[0].books[0].summary[0].user.login;
    return loginName;
  } catch (error) {
    console.error('Error getting login name:', error);
    throw error;
  }
}

// 构建目录树
function buildTree(catalogData) {
  const tree = { "0": [] };
  
  // 按层级排序
  const nodes = catalogData.data.sort((a, b) => a.level - b.level);
  
  // 构建树结构
  for (const node of nodes) {
    if (!tree[node.uuid]) {
      tree[node.uuid] = [];
    }
    if (node.parent_uuid === "") {
      tree["0"].push(node);
    } else {
      if (!tree[node.parent_uuid]) {
        tree[node.parent_uuid] = [];
      }
      tree[node.parent_uuid].push(node);
    }
  }
  
  return tree;
}

// DFS遍历目录树并下载文档
async function dfs(tree, nodeId, bookFolder, cookie, nodeInfo, loginName, bookSlug, currentPath = '') {
  for (const node of tree[nodeId] || []) {
    let folderPath = currentPath;
    
    // 如果是目录节点
    if (node.type === 'TITLE') {
      folderPath = currentPath + '/' + node.title;
      // 在zip中创建目录
      bookFolder.folder(folderPath.slice(1)); // 去掉开头的/
    }
    // 如果是文档节点
    else if (node.type === 'DOC' && nodeInfo[node.doc_id]) {
      const doc = nodeInfo[node.doc_id];
      try {
        // 构建下载链接
        const downloadUrl = `https://www.yuque.com/${loginName}/${bookSlug}/${doc.slug}/markdown?attachment=true&latexcode=true&anchor=false&linebreak=false`;
        console.log('Downloading:', downloadUrl);
        
        const contentResponse = await axios.get(downloadUrl, {
          headers: {
            ...yuqueHeaders,
            Cookie: cookie
          }
        });
        // 如果失败，重新尝试3次数
        let retry = 3;
        while (contentResponse.status !== 200 && retry > 0) {
          contentResponse = await axios.get(downloadUrl, {
            headers: {
              ...yuqueHeaders,
              Cookie: cookie
            }
          });
          retry--;
        }
        // 保存到对应目录
        const filePath = (folderPath + '/' + doc.title + '.md').slice(1);
        bookFolder.file(filePath, contentResponse.data);
        console.log(`文章 "${filePath}" 下载完成`);
      } catch (error) {
        console.error(`Error downloading doc ${doc.title}:`, error.message);
      }
    }
    
    // 递归处理子节点
    if (tree[node.uuid]) {
      await dfs(tree, node.uuid, bookFolder, cookie, nodeInfo, loginName, bookSlug, folderPath);
    }
  }
}

// 下载书籍（支持合并下载）
app.post('/api/books/download', async (req, res) => {
  try {
    const { cookie, books, merge } = req.body;
    
    // 获取用户登录名
    const loginName = await getLoginName(cookie);
    console.log('User login name:', loginName);

    // 创建 ZIP 文件
    const zip = new JSZip();

    // 处理每本书
    for (const book of books) {
      console.log(`Processing book: ${book.name}`);
      
      // 获取文档列表和目录结构
      const [docsResponse, catalogResponse] = await Promise.all([
        axios.get(`https://www.yuque.com/api/docs?book_id=${book.id}`, {
          headers: { ...yuqueHeaders, Cookie: cookie }
        }),
        axios.get(`https://www.yuque.com/api/catalog_nodes?book_id=${book.id}`, {
          headers: { ...yuqueHeaders, Cookie: cookie }
        })
      ]);

      // 创建书籍文件夹（如果是合并下载）
      const bookFolder = merge ? zip.folder(book.name) : zip;

      // 构建文档信息映射
      const nodeInfo = {};
      for (const doc of docsResponse.data.data) {
        nodeInfo[doc.id] = doc;
      }

      // 构建目录树并下载文档
      const tree = buildTree(catalogResponse.data);
      await dfs(tree, "0", bookFolder, cookie, nodeInfo, loginName, book.slug);
    }

    // 生成 ZIP 文件
    const content = await zip.generateAsync({ type: 'nodebuffer' });
    
    // 设置响应头
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 
      `attachment; filename=${encodeURIComponent(merge ? 'yuque-books.zip' : books[0].name + '.zip')}`);
    
    // 发送文件
    res.send(content);
    
    console.log('下载完成');
  } catch (error) {
    console.error('Error downloading books:', error.response?.data || error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`\nServer running on http://localhost:${PORT}`);
  console.log(`Test endpoint: http://localhost:${PORT}/api/test`);
  console.log('CORS enabled for localhost origins');
}); 