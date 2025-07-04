import { useState, useEffect } from 'react'
import './App.css'

// Import background images
import bg1 from './assets/1.jpg'
import bg2 from './assets/2.jpg'
import bg3 from './assets/3.jpg'
import bg4 from './assets/4.jpg'

const backgrounds = [
  { name: 'Background 1', image: bg1 },
  { name: 'Background 2', image: bg2 },
  { name: 'Background 3', image: bg3 },
  { name: 'Background 4', image: bg4 },
]

function App() {
  const [time, setTime] = useState(25 * 60) // 25 minutes
  const [isRunning, setIsRunning] = useState(false)
  const [currentBackground, setCurrentBackground] = useState(0)

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

  const nextBackground = () => {
    setCurrentBackground((prev) => (prev + 1) % backgrounds.length)
  }

  return (
    <div className="app" style={{ 
      backgroundImage: `url(${backgrounds[currentBackground].image})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <div className="content-wrapper">
        <header className="hero-section">
          <div className="hero-text">
            <h1 className="hero-title">PomodoroFocus</h1>
            <p className="hero-subtitle">Boost Your Productivity with Focused Work Sessions</p>
          </div>
        </header>
        
        <main className="timer-section">
          <div className="timer-card">
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
                onClick={() => setTime(25 * 60)}
              >
                Reset
              </button>
            </div>
          </div>
        </main>
        
        <div className="background-controls">
          <button 
            className="control-btn tertiary background-btn"
            onClick={nextBackground}
            title={`Current: ${backgrounds[currentBackground].name}`}
          >
            <span className="btn-icon">🎨</span>
            <span className="btn-text">Change Scene</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default App