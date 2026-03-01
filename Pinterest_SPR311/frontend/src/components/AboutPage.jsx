import Navbar from './Navbar'
import Sidebar from './Sidebar'
import './Home.css'

const AboutPage = () => {
  return (
    <div className="home-container">
      <Navbar />
      <div className="home-layout">
        <Sidebar />
        <main className="home-main">
          <h1 style={{ fontSize: '32px', marginBottom: '16px' }}>Про Inspira</h1>
          <p>
            Це інформаційна сторінка «Про нас». Тут можна розмістити текст про сервіс,
            команду та місію платформи.
          </p>
        </main>
      </div>
    </div>
  )
}

export default AboutPage

