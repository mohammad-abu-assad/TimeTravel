import { useEffect, useState } from 'react'
import { http } from './shared/api/http'

export default function App() {
  const [status, setStatus] = useState('checking...')
  useEffect(() => {
    http.get('/health')
      .then(r => setStatus(`${r.data.service}: ${r.data.status}`))
      .catch(() => setStatus('API not reachable'))
  }, [])
  return (
    <div className="container py-4">
      <h1>TimeTravel</h1>
      <div className="alert alert-info mt-3">API status: {status}</div>
    </div>
  )
}
