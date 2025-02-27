import { useState } from 'react'
import ConfigForm from './components/ConfigForm'
import BookList from './components/BookList'
import { getBooks, downloadBook } from './services/yuqueApi'
import './App.css'

function App() {
  const [cookie, setCookie] = useState('')
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState('')

  const handleConfigSubmit = async (newCookie) => {
    setLoading(true)
    setError('')
    try {
      const bookList = await getBooks(newCookie)
      setCookie(newCookie)
      setBooks(bookList)
    } catch (err) {
      setError('获取书籍列表失败，请检查Cookie是否正确')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (selectedBooks) => {
    setDownloading(true)
    setError('')
    try {
      const bookData = await Promise.all(
        selectedBooks.map(book => downloadBook(cookie, book.id, book.slug))
      )
      
      // Create a zip file with the downloaded content
      const zip = new JSZip()
      
      selectedBooks.forEach((book, index) => {
        const bookFolder = zip.folder(book.name)
        const { docs } = bookData[index]
        
        docs.forEach(doc => {
          bookFolder.file(`${doc.title}.md`, doc.content || '')
        })
      })
      
      const content = await zip.generateAsync({ type: 'blob' })
      const url = window.URL.createObjectURL(content)
      const a = document.createElement('a')
      a.href = url
      a.download = 'yuque-books.zip'
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      setError('下载过程中出现错误')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="app">
      <h1>语雀文档下载器</h1>
      {error && <div className="error">{error}</div>}
      
      {!books.length ? (
        <ConfigForm onSubmit={handleConfigSubmit} loading={loading} />
      ) : (
        <BookList 
          books={books} 
          onDownload={handleDownload}
          downloading={downloading}
        />
      )}
    </div>
  )
}

export default App
