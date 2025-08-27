import { useEffect, useState } from 'react'
import { http } from '../shared/api/http'

export default function HomePage() {
  const [text, setText] = useState('Loading…')
  useEffect(() => {
    http.get('/auth/me')
      .then(r => setText(`Hello ${r.data.me.email}`))
      .catch(() => setText('Auth failed'))
  }, [])
  return <h2>{text}</h2>
}
