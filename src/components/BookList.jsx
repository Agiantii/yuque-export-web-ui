import { useState } from 'react';

export default function BookList({ books, onDownload, downloading }) {
  const [selectedBooks, setSelectedBooks] = useState(new Set());

  const toggleBook = (bookId) => {
    const newSelected = new Set(selectedBooks);
    if (newSelected.has(bookId)) {
      newSelected.delete(bookId);
    } else {
      newSelected.add(bookId);
    }
    setSelectedBooks(newSelected);
  };

  const handleDownload = () => {
    const booksToDownload = books.filter(book => selectedBooks.has(book.id));
    onDownload(booksToDownload);
  };

  return (
    <div className="book-list">
      <h2>选择要下载的书籍</h2>
      <div className="books">
        {books.map(book => (
          <label key={book.id} className="book-item">
            <input
              type="checkbox"
              checked={selectedBooks.has(book.id)}
              onChange={() => toggleBook(book.id)}
              disabled={downloading}
            />
            {book.name}
          </label>
        ))}
      </div>
      <button 
        onClick={handleDownload}
        disabled={selectedBooks.size === 0 || downloading}
      >
        {downloading ? '下载中...' : '下载选中的书籍'}
      </button>
    </div>
  );
} 