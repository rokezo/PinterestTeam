import Navbar from './Navbar'
import Sidebar from './Sidebar'
import './Home.css'

const NewsPage = () => {
  return (
    <div className="home-container">
      <Navbar />
      <div className="home-layout">
        <Sidebar />
        <main className="home-main">
          <h1 style={{ fontSize: '32px', marginBottom: '16px' }}>Новини</h1>
          <p>
            Тут будуть оновлення та новини Inspira: новий функціонал, анонси та інші
            важливі повідомлення.
          </p>
        </main>
      </div>
    </div>
  )
}

export default NewsPage

