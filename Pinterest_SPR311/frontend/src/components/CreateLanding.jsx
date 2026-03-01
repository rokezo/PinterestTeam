import Navbar from './Navbar'
import Sidebar from './Sidebar'
import './Home.css'

const CreateLanding = () => {
  return (
    <div className="home-container">
      <Navbar />
      <div className="home-layout">
        <Sidebar />
        <main className="home-main">
          <h1 style={{ fontSize: '32px', marginBottom: '16px' }}>Створити</h1>
          <p>
            На цій сторінці можна буде описати різні способи створення контенту:
            піни, дошки, колажі та інше.
          </p>
        </main>
      </div>
    </div>
  )
}

export default CreateLanding

