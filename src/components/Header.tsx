import React, { useState, useEffect } from 'react'
import '../styles/Header.css'
import { ToggleThemeButton } from './ToggleThemeButton'

const Header: React.FC = () => {
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
        {/* Left: Logo and Brand */}
        <div className="header-brand header-left">
          <div className="logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <circle cx="16" cy="16" r="14" fill="#4facfe" stroke="#ffffff" strokeWidth="2"/>
              <path d="M16 6v10l6 4" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="16" cy="16" r="2" fill="#ffffff"/>
            </svg>
          </div>
          <h1 className="brand-name">Fomoduct</h1>
        </div>

        {/* Center: Time Display */}
        <div className="header-center">
          <div className="time-display">
            <div className="current-time">{formatTime(currentTime)}</div>
            <div className="current-date">{formatDate(currentTime)}</div>
          </div>
        </div>

        {/* Right: Theme Toggle */}
        <div className="header-right">
          <ToggleThemeButton />
        </div>
      </div>
    </header>
  )
}

export default Header
