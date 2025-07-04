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
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = '15px' // Compensate for scrollbar width
      
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
      }
    } else {
      document.body.style.overflow = 'unset'
      document.body.style.paddingRight = '0px'
    }
    
    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset'
      document.body.style.paddingRight = '0px'
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
          <span className="menu-icon">⚙️</span>
        </button>

        {/* Sliding Menu */}
        <div className={`settings-menu ${isMenuOpen ? 'open' : ''}`}>
          <div className="menu-header">
            <h3>Settings</h3>
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
            <h1 className="hero-title">PomodoroFocus</h1>
            <p className="hero-subtitle">Boost Your Productivity with Focused Work Sessions</p>
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