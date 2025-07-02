import { useState, useEffect } from 'react'

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
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>Pomodoro Timer</h1>
      <div style={{ fontSize: '3rem', margin: '2rem 0' }}>
        {formatTime(time)}
      </div>
      <div>
        <button onClick={() => setIsRunning(!isRunning)}>
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button onClick={() => setTime(25 * 60)}>
          Reset
        </button>
      </div>
    </div>
  )
}

export default App