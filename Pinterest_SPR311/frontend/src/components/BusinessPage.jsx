import Navbar from './Navbar'
import Sidebar from './Sidebar'
import './Home.css'

const BusinessPage = () => {
  return (
    <div className="home-container">
      <Navbar />
      <div className="home-layout">
        <Sidebar />
        <main className="home-main">
          <h1 style={{ fontSize: '32px', marginBottom: '16px' }}>Для бізнесу</h1>
          <p>
            Тут буде інформація для бізнес‑користувачів Inspira: можливості просування,
            аналітика та інші інструменти.
          </p>
        </main>
      </div>
    </div>
  )
}

export default BusinessPage

