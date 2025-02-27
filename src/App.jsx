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
  const tipalter= (msg,expileTime=2000) => {
    // 创建一个弹窗
    const tip = document.createElement('div')
    tip.innerHTML = msg
    tip.style.cssText = 'position: fixed; top: 10%; left: 50%; transform: translate(-50%, -50%); padding: 10px 20px; background-color: rgba(0, 0, 0, 0.8); color: #fff; border-radius: 5px; z-index: 9999;'
    document.body.appendChild(tip)
    // 一段时间后删除弹窗
    setTimeout(() => {
      document.body.removeChild(tip)
    }, expileTime)
  }
  const handleDownload = async (selectedBooks, mergeDownload) => {
    setDownloading(true)
    setError('')
    try {
      const startTime = Date.now()
      await downloadBooks(cookie, selectedBooks, mergeDownload)
      const endTime = Date.now()
      tipalter(`下载完成，耗时${(endTime - startTime) / 1000}秒`)
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
