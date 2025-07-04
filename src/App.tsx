import { useState, useEffect } from 'react'
import PomodoroLogo from './components/PomodoroLogo'
import './App.css'

function App() {
  const [time, setTime] = useState(25 * 60) // 25 minutes
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    if (!isRunning || time === 0) return

    const interval = setInterval(() => {
      setTime(prev => prev - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, time])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="logo-container">
          <PomodoroLogo size={64} className={isRunning ? 'running' : ''} />
          <div className="title-container">
            <h1 className="app-title">PomodoroFocus</h1>
            <p className="app-subtitle">Focus & Productivity</p>
          </div>
        </div>
      </header>
      
      <main className="timer-container">
        <div className="timer-display">
          {formatTime(time)}
        </div>
        <div className="timer-controls">
          <button 
            className={`control-btn ${isRunning ? 'pause' : 'start'}`}
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? '⏸️ Pause' : '▶️ Start'}
          </button>
          <button 
            className="control-btn reset"
            onClick={() => setTime(25 * 60)}
          >
            🔄 Reset
          </button>
        </div>
      </main>
    </div>
  )
}

export default App