import { useState, useEffect, useCallback, useRef } from 'react'
import './App.css'
import { SettingsMenu, SessionNotification, Header, NavigationBar } from './components'

function App() {
  const [time, setTime] = useState(25 * 60) // 25 minutes
  const [isRunning, setIsRunning] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [currentSession, setCurrentSession] = useState(0) // Track completed work sessions
  const [isBreakTime, setIsBreakTime] = useState(false) // Track if currently in break
  
  // Notification state
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState('')
  const [notificationSessionType, setNotificationSessionType] = useState<'work' | 'break'>('work')
  
  // Settings state
  const [workDuration, setWorkDuration] = useState(25)
  const [shortBreakDuration, setShortBreakDuration] = useState(5)
  const [longBreakDuration, setLongBreakDuration] = useState(15)
  const [sessionsBeforeLongBreak, setSessionsBeforeLongBreak] = useState(4)

  // Use refs to access latest state values in the interval callback
  const timeRef = useRef(time)
  const isBreakTimeRef = useRef(isBreakTime)
  const currentSessionRef = useRef(currentSession)
  const workDurationRef = useRef(workDuration)
  const shortBreakDurationRef = useRef(shortBreakDuration)
  const longBreakDurationRef = useRef(longBreakDuration)
  const sessionsBeforeLongBreakRef = useRef(sessionsBeforeLongBreak)

  // Update refs when state changes
  timeRef.current = time
  isBreakTimeRef.current = isBreakTime
  currentSessionRef.current = currentSession
  workDurationRef.current = workDuration
  shortBreakDurationRef.current = shortBreakDuration
  longBreakDurationRef.current = longBreakDuration
  sessionsBeforeLongBreakRef.current = sessionsBeforeLongBreak

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      const currentTime = timeRef.current
      
      if (currentTime === 0) {
        // Timer finished - pause timer and show notification
        setIsRunning(false)
        
        if (isBreakTimeRef.current) {
          // Break finished, prepare for next work session
          setIsBreakTime(false)
          setTime(workDurationRef.current * 60)
          setNotificationSessionType('break')
          setNotificationMessage(`Break time is over! Ready to start your next work session?`)
        } else {
          // Work session finished, prepare for break
          const completedSessions = currentSessionRef.current + 1
          setCurrentSession(completedSessions)
          setIsBreakTime(true)
          setNotificationSessionType('work')
          
          // Determine if it's time for long break and set timer accordingly
          if (completedSessions % sessionsBeforeLongBreakRef.current === 0) {
            setTime(longBreakDurationRef.current * 60)
            setNotificationMessage(`Great job! You've completed ${completedSessions} work sessions. Time for a long break!`)
          } else {
            setTime(shortBreakDurationRef.current * 60)
            setNotificationMessage(`Work session completed! You've earned a short break.`)
          }
        }
        
        // Show notification after session transition
        setShowNotification(true)
      } else {
        setTime(prev => prev - 1)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning]) // Only depend on isRunning

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev)
  }

  const toggleSettings = () => {
    setIsSettingsOpen(prev => !prev)
  }

  const updateWorkDuration = useCallback((minutes: number) => {
    setWorkDuration(minutes)
    if (!isRunning && !isBreakTime) {
      setTime(minutes * 60)
    }
  }, [isRunning, isBreakTime])

  const resetTimer = () => {
    setTime(workDuration * 60)
    setIsRunning(false)
    setIsBreakTime(false)
    setCurrentSession(0)
    // Reset notification state
    resetNotificationState()
  }

  const getCurrentPhase = () => {
    if (!isBreakTime) return 'Work Session'
    const isLongBreak = currentSession % sessionsBeforeLongBreak === 0
    return isLongBreak ? 'Long Break' : 'Short Break'
  }

  // Helper function to reset notification state
  const resetNotificationState = useCallback(() => {
    setShowNotification(false)
    setNotificationMessage('')
    setNotificationSessionType('work')
  }, [])

  const handleNotificationClose = useCallback(() => {
    resetNotificationState()
  }, [resetNotificationState])

  const handleStartNextSession = useCallback(() => {
    // Reset notification state and start the timer
    // The timer and session state are already prepared when the previous session ended
    resetNotificationState()
    setIsRunning(true)
  }, [resetNotificationState])

  // Request notification permission on component mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  // Reset notification when timer starts
  useEffect(() => {
    if (isRunning) {
      resetNotificationState()
    }
  }, [isRunning, resetNotificationState])

  return (
    <div className="app">
      <div className="content-wrapper">
        {/* Header */}
        <Header
          isMenuOpen={isMenuOpen}
          onToggleMenu={toggleMenu}
          onToggleSettings={toggleSettings}
          onTimerClick={() => {
            // Focus on timer section or scroll to timer
            console.log('Timer navigation clicked')
          }}
        />

        {/* Desktop Navigation Bar - Right Side */}
        <NavigationBar
          isMenuOpen={isSettingsOpen}
          onToggleMenu={toggleSettings}
          onTimerClick={() => {
            // Focus on timer section or scroll to timer
            console.log('Timer navigation clicked')
          }}
        />

        <SettingsMenu
          isOpen={isSettingsOpen}
          onClose={toggleSettings}
          workDuration={workDuration}
          shortBreakDuration={shortBreakDuration}
          longBreakDuration={longBreakDuration}
          sessionsBeforeLongBreak={sessionsBeforeLongBreak}
          onWorkDurationChange={updateWorkDuration}
          onShortBreakChange={setShortBreakDuration}
          onLongBreakChange={setLongBreakDuration}
          onSessionsChange={setSessionsBeforeLongBreak}
        />

        <main className={`timer-section ${isMenuOpen ? 'menu-open' : ''}`}>
          <div className="panels-container">
            {/* Timer Panel */}
            <div className="timer-panel">
              <div className="card timer-card">
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
                    type="button"
                    className={`control-btn primary ${isRunning ? 'pause' : 'start'}`}
                    onClick={() => setIsRunning(!isRunning)}
                  >
                    {isRunning ? 'Pause' : 'Start'}
                  </button>
                  <button 
                    type="button"
                    className="control-btn secondary reset"
                    onClick={resetTimer}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Task Tracker Panel */}
            <div className="task-panel">
              <div className="card task-card">
                <div className="task-header">
                  <h3>Task Tracker</h3>
                </div>
                <div className="task-content">
                  <div className="task-list">
                    {/* Task list will be implemented here */}
                    <div className="task-item placeholder">
                      <div className="task-checkbox"></div>
                      <div className="task-text">Add your first task...</div>
                    </div>
                  </div>
                  <div className="task-stats">
                    <div className="stat-item">
                      <span className="stat-label">Today's Tasks</span>
                      <span className="stat-value">0</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Completed</span>
                      <span className="stat-value">0</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Session Notification */}
        <SessionNotification
          isVisible={showNotification}
          message={notificationMessage}
          sessionType={notificationSessionType}
          onClose={handleNotificationClose}
          onStartNext={handleStartNextSession}
          autoCloseDelay={8000}
        />
      </div>
    </div>
  )
}

export default App