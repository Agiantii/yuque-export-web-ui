# Yuque 导出文档的 Web UI

这是一个用于导出 Yuque 文档的 Web UI 项目。该项目允许用户通过 Web 界面输入 Cookie 并选择要导出的书籍，最终生成包含所选书籍的 ZIP 文件。


# ps
- 你可以结合 [img-immigrate](https://github.com/Agiantii/img-immigrate.git)实现
  - 本地图片迁移至图床
  - 图床 迁移至 本地
  - 图床 迁移 至 图床
- yuque-export-web-ui 改自 [yuque-export-simple](https://github.com/Agiantii/yuque-export-simple.git)

## Q&A
####  如何获取cookkie

进入[语雀](https://www.yuque.com/dashboard) `F12` 打开开发者工具
进入 console 输入 `document.cookie` 回车即可获取到 `cookie`

####  是否会泄露用户的cookie以及其他信息

不会,本项目所有代码 可在[github](https://github.com/Agiantii/yuque-export-web-ui) 查看

####  下载速率如何
大概是 100篇/s 左右, 但是由于网络原因可能会有波动

如果能对您有所帮助,那再好不过了,如果有任何问题,欢迎提issue

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
cd yuque-export-web-ui
```
### 启动前端

```bash
npm install
```
```bash
npm run dev
```
### 启动后端

```bash
cd server
```
```bash
npm install
```
```bash
npm run start
```


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
