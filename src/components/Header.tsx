import { useState, useEffect } from 'react'
import '../styles/Header.css'
import { NavButton } from './index'
import { ToggleThemeButton } from './ToggleThemeButton'

interface HeaderProps {
  isMenuOpen: boolean
  isSettingsOpen: boolean
  onToggleMenu: () => void
  onToggleSettings: () => void
  onTimerClick: () => void
}

const Header: React.FC<HeaderProps> = ({ isMenuOpen, isSettingsOpen, onToggleMenu, onToggleSettings, onTimerClick }) => {
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
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
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
        <nav className="header-nav desktop-nav" aria-label="Header navigation">
          <NavButton
            variant="timer"
            style="header"
            onClick={onTimerClick}
          />
          <NavButton
            variant="settings"
            style="header"
            onClick={onToggleSettings}
            ariaExpanded={isSettingsOpen}
            ariaControls="settings-menu"
          />
        </nav>

        {/* Mobile Menu Toggle & Theme Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ToggleThemeButton />
          <div className="mobile-menu-toggle">
            <button 
              className={`hamburger ${isMenuOpen ? 'open' : ''}`}
              onClick={onToggleMenu}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-dropdown"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
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
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="mobile-dropdown" id="mobile-dropdown">          
          <div className="dropdown-content">
            <NavButton
              variant="timer"
              style="header-dropdown"
              onClick={() => {
                onTimerClick()
                onToggleMenu()
              }}
            />
            <NavButton
              variant="settings"
              style="header-dropdown"
              onClick={() => {
                onToggleSettings()
                onToggleMenu()
              }}
            />
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
