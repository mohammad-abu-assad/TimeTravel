// src/widgets/Navbar/Navbar.tsx
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../shared/auth/AuthProvider'
import { useEffect, useMemo, useState, useCallback } from 'react'

export default function Navbar() {
  const { user, loading, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  // Close the mobile menu whenever the route changes
  useEffect(() => setOpen(false), [location.pathname])

  const pageTitle = useMemo(() => {
    const p = location.pathname
    if (p.startsWith('/capsules/new')) return 'Create Capsule'
    if (p.startsWith('/capsules')) return 'My Capsules'
    if (p.startsWith('/login')) return 'Log in'
    if (p.startsWith('/register')) return 'Sign up'
    return 'Home'
  }, [location.pathname])

  const handleLogout = useCallback(() => {
    logout()
    navigate('/login', { replace: true })
  }, [logout, navigate])

  // Helper to build active classes for NavLink
  const navLink = useCallback(
    (base: string) =>
      ({ isActive }: { isActive: boolean }) => base + (isActive ? ' active fw-semibold' : ''),
    []
  )

  return (
    <header className="sticky-top bg-white border-bottom shadow-sm">
      <nav className="navbar navbar-expand-md" role="navigation" aria-label="Primary">
        <div className="container tt-container">
          {/* Brand + crumb */}
          <div className="d-flex align-items-center gap-2">
            <NavLink className="navbar-brand fw-bold" to="/">
              TimeTravel
            </NavLink>
            <span className="text-muted d-none d-md-inline">{pageTitle}</span>
          </div>

          {/* Toggler (React controlled) */}
          <button
            className="navbar-toggler ms-auto"
            type="button"
            aria-controls="ttNav"
            aria-expanded={open}
            aria-label="Toggle navigation"
            onClick={() => setOpen(s => !s)}
          >
            <span className="navbar-toggler-icon" />
          </button>

          {/* Collapsible */}
          <div id="ttNav" className={`navbar-collapse ${open ? 'show' : 'collapse'}`}>
            {/* Left nav */}
            <ul className="navbar-nav me-auto mb-2 mb-md-0 mt-3 mt-md-0">
              {user && (
                <>
                  <li className="nav-item">
                    <NavLink to="/capsules" className={navLink('nav-link')}>
                      Capsules
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/capsules/new" className={navLink('nav-link')}>
                      Create
                    </NavLink>
                  </li>
                </>
              )}
            </ul>

            {/* Right actions */}
            <div className="d-flex align-items-center gap-2 mb-3 mb-md-0">
              {loading ? (
                <span className="text-muted small">loading…</span>
              ) : user ? (
                <>
                  <span className="text-muted small d-none d-sm-inline">{user.email}</span>
                  <button
                    className="btn btn-outline-secondary btn-sm text-nowrap px-3"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  {/* Login: outline primary */}
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      [
                        'btn btn-outline-primary btn-sm',
                        'text-nowrap d-inline-flex align-items-center px-3',
                        // full width inside collapse, auto on md+
                        'w-100 w-md-auto',
                        'mb-2 mb-md-0',
                        isActive ? 'active' : '',
                      ].join(' ')
                    }
                  >
                    Login
                  </NavLink>

                  {/* Sign up: solid success (CTA) */}
                  <NavLink
                    to="/register"
                    className={({ isActive }) =>
                      [
                        'btn btn-success btn-sm', // solid green to stand out
                        'text-nowrap d-inline-flex align-items-center px-3',
                        'w-100 w-md-auto',
                        'mb-2 mb-md-0',
                        isActive ? 'active' : '',
                      ].join(' ')
                    }
                  >
                    Sign up
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
