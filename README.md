# Yuque 导出文档的 Web UI

这是一个用于导出 Yuque 文档的 Web UI 项目。该项目允许用户通过 Web 界面输入 Cookie 并选择要导出的书籍，最终生成包含所选书籍的 ZIP 文件。

## 项目结构

```
/src
  /assets
    react.svg
  /components
    BookList.jsx
    BookList.css
    ConfigForm.jsx
  /services
    yuqueApi.js
  App.jsx
  App.css
  index.css
  main.jsx
```

## 安装与运行

### clone

```bash
git clone https://github.com/Agiantii/yuque-export-web-ui
```
```bash
cd yuque-export-web
```

### 


## 使用方法

1. 在输入框中输入你的 Yuque Cookie。
2. 点击“获取书籍列表”按钮获取你的书籍列表。
3. 在书籍列表中选择要导出的书籍。
4. 点击“下载选中的知识库”按钮下载包含所选书籍的 ZIP 文件。

## 主要功能

- **获取书籍列表**：通过输入 Yuque Cookie 获取用户的书籍列表。
- **搜索书籍**：通过搜索框可以快速查找特定书籍。
- **选择书籍**：支持单选和全选书籍。
- **下载书籍**：支持合并下载和分别下载书籍。

## 贡献

欢迎提交问题和拉取请求。如果你有任何建议或改进，请随时提出。

## 许可证

本项目采用 MIT 许可证。
