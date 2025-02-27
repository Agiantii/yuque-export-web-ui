import { useState } from 'react';
import './BookList.css';

function BookList({ books, onDownload, downloading }) {
  const [selectedBooks, setSelectedBooks] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectAll, setSelectAll] = useState(false);
  const [mergeDownload, setMergeDownload] = useState(true); // 默认合并下载

  // 过滤后的书籍列表
  const filteredBooks = books.filter(book => 
    book.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 处理全选/取消全选
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedBooks(new Set());
    } else {
      setSelectedBooks(new Set(filteredBooks.map(book => book.id)));
    }
    setSelectAll(!selectAll);
  };

  // 处理单个选择
  const handleSelect = (bookId) => {
    const newSelected = new Set(selectedBooks);
    if (newSelected.has(bookId)) {
      newSelected.delete(bookId);
      setSelectAll(false);
    } else {
      newSelected.add(bookId);
      if (newSelected.size === filteredBooks.length) {
        setSelectAll(true);
      }
    }
    setSelectedBooks(newSelected);
  };

  // 处理下载
  const handleDownload = () => {
    const booksToDownload = books.filter(book => selectedBooks.has(book.id));
    onDownload(booksToDownload, mergeDownload);
  };

  return (
    <div className="book-list-container">
      <div className="book-list-header">
        <div className="search-bar">
          <input
            type="text"
            placeholder="搜索知识库..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="actions">
          <label className="select-all">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAll}
            />
            全选
          </label>
          <button
            onClick={handleDownload}
            disabled={downloading || selectedBooks.size === 0}
            className="download-button"
          >
            {downloading ? '下载中...' : `下载选中的知识库 (${selectedBooks.size})`}
          </button>
        </div>
      </div>

      <div className="book-grid">
        {filteredBooks.map(book => (
          <div key={book.id} className="book-card">
            <label className="book-item">
              <input
                type="checkbox"
                checked={selectedBooks.has(book.id)}
                onChange={() => handleSelect(book.id)}
              />
              <div className="book-info">
                <h3 className="book-name">{book.name}</h3>
                <p className="book-id">ID: {book.id}</p>
              </div>
            </label>
          </div>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="no-results">
          没有找到匹配的知识库
        </div>
      )}
    </div>
  );
}

export default BookList; 