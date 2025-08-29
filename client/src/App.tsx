import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './widgets/Navbar/Navbar'
import LoginPage from './features/auth/pages/LoginPage'
import RegisterPage from './features/auth/pages/RegisterPage'
import HomePage from './pages/HomePage'
import { useAuth } from './shared/auth/AuthProvider'
import AppShell from './layouts/AppShell'

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
          <Route path="/" element={<RequireAuth><AppShell><HomePage /></AppShell></RequireAuth>} />
          <Route path="/capsules" element={<RequireAuth><AppShell><div>Capsules list</div></AppShell></RequireAuth>} />
          <Route path="/capsules/new" element={<RequireAuth><AppShell><div>Create capsule</div></AppShell></RequireAuth>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<div>Not found</div>} />
        </Routes>
      </main>
    </>
  )
}
