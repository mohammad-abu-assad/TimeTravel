import PageHeader from '../shared/ui/PageHeader'
import { useEffect, useState } from 'react'
import { http } from '../shared/api/http'

export default function HomePage() {
  const [email, setEmail] = useState<string>('')

  useEffect(() => {
    http.get('/auth/me').then(r => setEmail(r.data.me.email)).catch(() => setEmail(''))
  }, [])

  return (
    <>
      <PageHeader title="Home" subtitle="Your timeline at a glance" />
      <div className="p-4 bg-white rounded-3 shadow-sm">
        <h5 className="mb-0">Hello {email}</h5>
      </div>
    </>
  )
}
