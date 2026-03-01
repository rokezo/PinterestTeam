import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import PinGrid from './PinGrid'
import './Home.css'

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() })
    } else {
      setSearchParams({})
    }
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  return (
    <div className="home-container">
      <Navbar />
      <div className="home-layout">
        <Sidebar />
        <main className="home-main">
          <div className="home-search-wrapper">
            <form className="home-search-bar" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Пошук........"
                className="home-search-input"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </form>
          </div>
          <PinGrid />
        </main>
      </div>
    </div>
  )
}

export default Home

