import { useState, useEffect } from 'react'
import PomodoroLogo from './components/PomodoroLogo'
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
      <div className="overlay">
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
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button 
            className="control-btn reset"
            onClick={() => setTime(25 * 60)}
          >
            Reset
          </button>
        </div>
      </main>
      
      <div className="background-controls">
        <button 
          className="control-btn background-btn"
          onClick={nextBackground}
          title={`Current: ${backgrounds[currentBackground].name}`}
        >
          🎨 Change Background
        </button>
      </div>
      </div>
    </div>
  )
}

export default App