import { useState, useEffect } from 'react'
import './App.css'

// Import single background image
import bgImage from './assets/background.jpg'

function App() {
  const [time, setTime] = useState(25 * 60) // 25 minutes
  const [isRunning, setIsRunning] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentSession, setCurrentSession] = useState(0) // Track completed work sessions
  const [isBreakTime, setIsBreakTime] = useState(false) // Track if currently in break
  
  // Settings state
  const [workDuration, setWorkDuration] = useState(25)
  const [shortBreakDuration, setShortBreakDuration] = useState(5)
  const [longBreakDuration, setLongBreakDuration] = useState(15)
  const [sessionsBeforeLongBreak, setSessionsBeforeLongBreak] = useState(4)

  useEffect(() => {
    if (!isRunning) return
    
    if (time === 0) {
      // Timer finished - auto switch between work and break
      if (isBreakTime) {
        // Break finished, start new work session
        setIsBreakTime(false)
        setTime(workDuration * 60)
      } else {
        // Work session finished, start break
        const completedSessions = currentSession + 1
        setCurrentSession(completedSessions)
        setIsBreakTime(true)
        
        // Determine if it's time for long break
        if (completedSessions % sessionsBeforeLongBreak === 0) {
          setTime(longBreakDuration * 60)
        } else {
          setTime(shortBreakDuration * 60)
        }
      }
      return
    }

    const interval = setInterval(() => {
      setTime(prev => prev - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, time, isBreakTime, currentSession, workDuration, shortBreakDuration, longBreakDuration, sessionsBeforeLongBreak])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      // Store original values
      const originalOverflow = document.body.style.overflow
      
      // Prevent scrolling without layout shift (since scrollbar is hidden)
      document.body.style.overflow = 'hidden'
      
      // Focus trap within menu
      const settingsMenu = document.querySelector('.settings-menu')
      const focusableElements = settingsMenu?.querySelectorAll(
        'button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const firstElement = focusableElements?.[0] as HTMLElement
      const lastElement = focusableElements?.[focusableElements.length - 1] as HTMLElement
      
      // Prevent keyboard navigation to elements outside menu
      const handleKeyDown = (e: KeyboardEvent) => {
        // Allow ESC to close menu
        if (e.key === 'Escape') {
          setIsMenuOpen(false)
          return
        }
        
        // Handle Tab key for focus trap
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstElement) {
              e.preventDefault()
              lastElement?.focus()
            }
          } else {
            // Tab
            if (document.activeElement === lastElement) {
              e.preventDefault()
              firstElement?.focus()
            }
          }
        }
      }
      
      document.addEventListener('keydown', handleKeyDown)
      
      // Auto focus first element when menu opens
      setTimeout(() => firstElement?.focus(), 100)
      
      return () => {
        document.removeEventListener('keydown', handleKeyDown)
        // Restore original values
        document.body.style.overflow = originalOverflow
      }
    }
    
    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const updateWorkDuration = (minutes: number) => {
    setWorkDuration(minutes)
    if (!isRunning && !isBreakTime) {
      setTime(minutes * 60)
    }
  }

  const handleWorkDurationInput = (value: string) => {
    const num = parseInt(value) || 1
    const validNum = Math.max(1, Math.min(180, num)) // Limit between 1-180 minutes
    updateWorkDuration(validNum)
  }

  const handleShortBreakInput = (value: string) => {
    const num = parseInt(value) || 1
    const validNum = Math.max(1, Math.min(60, num)) // Limit between 1-60 minutes
    setShortBreakDuration(validNum)
  }

  const handleLongBreakInput = (value: string) => {
    const num = parseInt(value) || 1
    const validNum = Math.max(1, Math.min(120, num)) // Limit between 1-120 minutes
    setLongBreakDuration(validNum)
  }

  const handleSessionsInput = (value: string) => {
    const num = parseInt(value) || 2
    const validNum = Math.max(2, Math.min(20, num)) // Limit between 2-20 sessions
    setSessionsBeforeLongBreak(validNum)
  }

  const resetTimer = () => {
    setTime(workDuration * 60)
    setIsRunning(false)
    setIsBreakTime(false)
    setCurrentSession(0)
  }

  const getCurrentPhase = () => {
    if (!isBreakTime) return 'Work Session'
    const isLongBreak = currentSession % sessionsBeforeLongBreak === 0
    return isLongBreak ? 'Long Break' : 'Short Break'
  }

  return (
    <div className="app" style={{ 
      backgroundImage: `url(${bgImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <div className="content-wrapper">
        {/* Menu Button */}
        <button 
          className={`menu-toggle ${isMenuOpen ? 'hidden' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle Settings Menu"
        >
          <svg className="menu-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 8C9.79 8 8 9.79 8 12C8 14.21 9.79 16 12 16C14.21 16 16 14.21 16 12C16 9.79 14.21 8 12 8ZM12 14C10.9 14 10 13.1 10 12C10 10.9 10.9 10 12 10C13.1 10 14 10.9 14 12C14 13.1 13.1 14 12 14Z" fill="white"/>
            <path d="M19.43 12.98C19.47 12.66 19.5 12.34 19.5 12C19.5 11.66 19.47 11.34 19.43 11.02L21.54 9.37C21.73 9.22 21.78 8.95 21.66 8.73L19.66 5.27C19.54 5.05 19.27 4.97 19.05 5.05L16.56 6.05C16.04 5.65 15.48 5.32 14.87 5.07L14.49 2.42C14.46 2.18 14.25 2 14 2H10C9.75 2 9.54 2.18 9.51 2.42L9.13 5.07C8.52 5.32 7.96 5.66 7.44 6.05L4.95 5.05C4.72 4.96 4.46 5.05 4.34 5.27L2.34 8.73C2.21 8.95 2.27 9.22 2.46 9.37L4.57 11.02C4.53 11.34 4.5 11.67 4.5 12C4.5 12.33 4.53 12.66 4.57 12.98L2.46 14.63C2.27 14.78 2.21 15.05 2.34 15.27L4.34 18.73C4.46 18.95 4.73 19.03 4.95 18.95L7.44 17.95C7.96 18.35 8.52 18.68 9.13 18.93L9.51 21.58C9.54 21.82 9.75 22 10 22H14C14.25 22 14.46 21.82 14.49 21.58L14.87 18.93C15.48 18.68 16.04 18.34 16.56 17.95L19.05 18.95C19.28 19.04 19.54 18.95 19.66 18.73L21.66 15.27C21.78 15.05 21.73 14.78 21.54 14.63L19.43 12.98Z" fill="white"/>
          </svg>
        </button>

        {/* Sliding Menu */}
        <div 
          className={`settings-menu ${isMenuOpen ? 'open' : ''}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="settings-menu-title"
          aria-hidden={!isMenuOpen}
        >
          <div className="menu-header">
            <h3 id="settings-menu-title">Settings</h3>
            <button 
              className="close-btn"
              onClick={toggleMenu}
              aria-label="Close Menu"
            >
              ×
            </button>
          </div>
          
          <div className="menu-content">
            <div className="setting-group">
              <label>Work Duration (minutes)</label>
              <div className="duration-controls">
                <button 
                  onClick={() => updateWorkDuration(Math.max(1, workDuration - 1))}
                  className="duration-btn"
                >
                  -
                </button>
                <input
                  type="number"
                  value={workDuration}
                  onChange={(e) => handleWorkDurationInput(e.target.value)}
                  className="duration-input"
                  min="1"
                  max="180"
                />
                <button 
                  onClick={() => updateWorkDuration(workDuration + 1)}
                  className="duration-btn"
                >
                  +
                </button>
              </div>
            </div>

            <div className="setting-group">
              <label>Short Break Duration (minutes)</label>
              <div className="duration-controls">
                <button 
                  onClick={() => setShortBreakDuration(Math.max(1, shortBreakDuration - 1))}
                  className="duration-btn"
                >
                  -
                </button>
                <input
                  type="number"
                  value={shortBreakDuration}
                  onChange={(e) => handleShortBreakInput(e.target.value)}
                  className="duration-input"
                  min="1"
                  max="60"
                />
                <button 
                  onClick={() => setShortBreakDuration(shortBreakDuration + 1)}
                  className="duration-btn"
                >
                  +
                </button>
              </div>
            </div>

            <div className="setting-group">
              <label>Long Break Duration (minutes)</label>
              <div className="duration-controls">
                <button 
                  onClick={() => setLongBreakDuration(Math.max(1, longBreakDuration - 1))}
                  className="duration-btn"
                >
                  -
                </button>
                <input
                  type="number"
                  value={longBreakDuration}
                  onChange={(e) => handleLongBreakInput(e.target.value)}
                  className="duration-input"
                  min="1"
                  max="120"
                />
                <button 
                  onClick={() => setLongBreakDuration(longBreakDuration + 1)}
                  className="duration-btn"
                >
                  +
                </button>
              </div>
            </div>

            <div className="setting-group">
              <label>Sessions Before Long Break</label>
              <div className="duration-controls">
                <button 
                  onClick={() => setSessionsBeforeLongBreak(Math.max(2, sessionsBeforeLongBreak - 1))}
                  className="duration-btn"
                >
                  -
                </button>
                <input
                  type="number"
                  value={sessionsBeforeLongBreak}
                  onChange={(e) => handleSessionsInput(e.target.value)}
                  className="duration-input"
                  min="2"
                  max="20"
                />
                <button 
                  onClick={() => setSessionsBeforeLongBreak(sessionsBeforeLongBreak + 1)}
                  className="duration-btn"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Full Screen Overlay - Blocks all interactions */}
        {isMenuOpen && (
          <div 
            className="menu-overlay" 
            onClick={toggleMenu}
            onWheel={(e) => e.preventDefault()}
            onTouchMove={(e) => e.preventDefault()}
          ></div>
        )}

        <header className={`hero-section ${isMenuOpen ? 'menu-open' : ''}`}>
          <div className="hero-text">
            <h1 className="hero-title">Fomoduct</h1>
            <p className="hero-subtitle">Focus & Productivity Made Simple</p>
          </div>
        </header>
        
        <main className={`timer-section ${isMenuOpen ? 'menu-open' : ''}`}>
          <div className="timer-card">
            <div className="session-info">
              <div className="current-phase">{getCurrentPhase()}</div>
              <div className="session-counter">
                Session {currentSession + (isBreakTime ? 0 : 1)} • Completed: {currentSession}
              </div>
            </div>
            <div className="timer-display">
              {formatTime(time)}
            </div>
            <div className="timer-controls">
              <button 
                className={`control-btn primary ${isRunning ? 'pause' : 'start'}`}
                onClick={() => setIsRunning(!isRunning)}
              >
                {isRunning ? 'Pause' : 'Start'}
              </button>
              <button 
                className="control-btn secondary reset"
                onClick={resetTimer}
              >
                Reset
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App