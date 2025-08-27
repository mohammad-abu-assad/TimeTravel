import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './widgets/Navbar/Navbar'
import LoginPage from './features/auth/pages/LoginPage'
import RegisterPage from './features/auth/pages/RegisterPage'
import HomePage from './pages/HomePage'
import { useAuth } from './shared/auth/AuthProvider'

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth()
  if (loading) return <div className="container py-4">Loading…</div>
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container py-4">
        <Routes>
          <Route path="/" element={<RequireAuth><HomePage /></RequireAuth>} />
          <Route path="/capsules" element={<RequireAuth><div>Capsules list (todo)</div></RequireAuth>} />
          <Route path="/capsules/new" element={<RequireAuth><div>Create capsule (todo)</div></RequireAuth>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<div>Not found</div>} />
        </Routes>
      </main>
    </>
  )
}
