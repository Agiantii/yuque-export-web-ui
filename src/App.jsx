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
      <div
        style={{
          margin: "10px",
          height:"40px"
        }}
      >
        <a href="http://blog.agiantii.top/post/project/yuque-export-web-ui/Q&A.html#q-a" target="_blank" rel="noreferrer"
          className='link'
        >Q&A</a>
        <a href="https://github.com/Agiantii/yuque-export-web-ui.git" target="_blank" rel="noreferrer"
          className='link'
        >github</a>
        <a href="https://github.com/Agiantii/yuque-export-web-ui/issues" target="_blank" rel="noreferrer"
          className='link'
        >issues</a>
        <a href="https://github.com/Agiantii/yuque-export-web-ui" target="_blank" rel="noreferrer"
          className='link'
        >点个start吧</a>
      </div>
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
     {
        ! books.length &&(
          <footer className="mt-10 text-gray-500 text-sm max-w-xl text-center">
            <p>
              进入
              <a href="https://www.yuque.com/api/mine" target="_blank" rel="noreferrer" className="text-blue-500 underline mx-1">
                https://www.yuque.com/api/mine
              </a>
              <span className="font-mono bg-gray-200 px-1 rounded">F12</span>
              打开开发者工具，打开
              <span className="font-mono bg-gray-200 px-1 rounded">network/网络</span>
              选项卡，搜索
              <span className="font-mono bg-gray-200 px-1 rounded">mine</span>
              这个请求，复制其cookie即可
            </p>
            <div className='w-full max-w-xl mx-auto mt-4'>
              <img
                src="/assets/README/Snipaste_2025-05-14_10-21-39.png"
                alt="GitHub Logo"
                className='w-full h-24 object-cover mt-2'
                style={{ width: '100%', height: '100', marginTop: '10px' }}
              />
            </div>
          </footer>
        )
     }
    </div>
  )
}

export default App
