import { useState, useEffect } from 'react'
import '../styles/Header.css'

interface HeaderProps {
  isMenuOpen: boolean
  onToggleMenu: () => void
  onToggleSettings: () => void
  onTimerClick: () => void
}

const Header: React.FC<HeaderProps> = ({ isMenuOpen, onToggleMenu, onToggleSettings, onTimerClick }) => {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <header className="header">
      <div className="header-content">
        {/* Logo and Brand */}
        <div className="header-brand">
          <div className="logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="14" fill="#4facfe" stroke="#ffffff" strokeWidth="2"/>
              <path d="M16 6v10l6 4" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="16" cy="16" r="2" fill="#ffffff"/>
            </svg>
          </div>
          <h1 className="brand-name">Fomoduct</h1>
        </div>

        {/* Center Content - Time Display */}
        <div className="header-center">
          <div className="time-display">
            <div className="current-time">{formatTime(currentTime)}</div>
            <div className="current-date">{formatDate(currentTime)}</div>
          </div>
          <div className="separator"></div>
          <div className="productivity-indicator">
            <div className="indicator-dot"></div>
            <span>Focus Mode</span>
          </div>
        </div>

        {/* Navigation - Desktop */}
        <nav className="header-nav desktop-nav">
          <button 
            className="nav-item"
            onClick={onTimerClick}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Timer
          </button>
          <button 
            className="nav-item"
            onClick={onToggleSettings}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 15l3-3H9l3 3z" fill="currentColor"/>
              <path d="M12 9l3 3H9l3-3z" fill="currentColor"/>
            </svg>
            Settings
          </button>
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="mobile-menu-toggle">
          <button 
            className={`hamburger ${isMenuOpen ? 'open' : ''}`}
            onClick={onToggleMenu}
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M3 6h18M3 12h18M3 18h18" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="hamburger-lines"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="mobile-dropdown">
          <div className="dropdown-content">
            <button 
              className="dropdown-item"
              onClick={() => {
                onTimerClick()
                onToggleMenu()
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
                <path 
                  d="M12 7v5l3 3" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
              </svg>
              Timer
            </button>
            <button 
              className="dropdown-item"
              onClick={() => {
                onToggleSettings()
                onToggleMenu()
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                <path 
                  d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" 
                  stroke="currentColor" 
                  strokeWidth="1.5"
                />
              </svg>
              Settings
            </button>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
