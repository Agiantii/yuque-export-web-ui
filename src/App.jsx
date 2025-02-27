import { useState,useEffect } from 'react'
import ConfigForm from './components/ConfigForm'
import BookList from './components/BookList'
import { getBooks, downloadBooks } from './services/yuqueApi'
import './App.css'

function App() {
  const [cookie, setCookie] = useState('')
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState('')

  useEffect(()=>{
    if(localStorage.getItem("cookie")){
      try{
        handleConfigSubmit(localStorage.getItem("cookie"))
      }
      catch(err){
        setError('获取书籍列表失败，请检查Cookie是否正确 已为你移除本地cookie')
        localStorage.removeItem("cookie")
      }
    }
  },[])
  const handleConfigSubmit = async (newCookie) => {
    setLoading(true)
    setError('')
    try {
      const bookList = await getBooks(newCookie)
      setCookie(newCookie)
      setBooks(bookList)
      localStorage.setItem("cookie",newCookie)
    } catch (err) {
      setError('获取书籍列表失败，请检查Cookie是否正确')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (selectedBooks, mergeDownload) => {
    setDownloading(true)
    setError('')
    try {
      await downloadBooks(cookie, selectedBooks, mergeDownload)
    } catch (err) {
      setError('下载过程中出现错误')
      console.error('Download error:', err)
    } finally {
      setDownloading(false)
    }
  }
  const removeCookie = () => {  
    alert("已移除cookie")
    localStorage.removeItem("cookie")
  }
  return (
    <div className="app">
      <h1>yuque-export</h1>
      {error && <div className="error">{error}</div>}
      
      {!books.length ?(
        <ConfigForm onSubmit={handleConfigSubmit} loading={loading} />
      ) : (

          <>
            <div className="cookie">
              <button onClick={removeCookie}>移除cookie</button>
            </div>
            <BookList
              books={books}
              onDownload={handleDownload}
              downloading={downloading}
            />
          </>
      )}
    </div>
  )
}

export default App
