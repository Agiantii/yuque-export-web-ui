const API_BASE = 'http://localhost:5000/api';

const headers = {
  'Referer': 'https://www.yuque.com',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
  'Content-Type': 'application/json'
};

export const getBooks = async (cookie) => {
  try {
    console.log('Attempting to fetch books with URL:', `${API_BASE}/books`);
    
    const response = await fetch(`${API_BASE}/books`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ cookie })
    });

    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);

    if (!data.data?.[0]?.books) {
      throw new Error('Failed to fetch books');
    }

    return data.data[0].books.map(book => ({
      name: book.name,
      id: book.id,
      slug: book.slug
    }));
  } catch (error) {
    console.error('Error in getBooks:', error);
    throw error;
  }
};

export const downloadBooks = async (cookie, books, merge = true) => {
  try {
    console.log(`开始${merge ? '合并' : '分别'}下载 ${books.length} 本书籍`);
    
    const response = await fetch(`${API_BASE}/books/download`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        cookie,
        books: books.map(book => ({
          id: book.id,
          name: book.name,
          slug: book.slug
        })),
        merge
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 获取二进制数据
    const blob = await response.blob();
    
    // 创建下载链接
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = merge ? 'yuque-books.zip' : `${books[0].name}.zip`;
    document.body.appendChild(a);
    a.click();
    
    // 清理
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    console.log('下载完成');
  } catch (error) {
    console.error('Error downloading books:', error);
    throw error;
  }
}; 