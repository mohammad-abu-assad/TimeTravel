import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../shared/auth/AuthProvider'

export default function Navbar() {
  const { user, loading, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  // Simple page label based on route
  const pageTitle = (() => {
    if (location.pathname.startsWith('/capsules/new')) return 'Create Capsule'
    if (location.pathname.startsWith('/capsules')) return 'My Capsules'
    if (location.pathname.startsWith('/login')) return 'Log in'
    if (location.pathname.startsWith('/register')) return 'Sign up'
    return 'Home'
  })()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <nav className="navbar navbar-expand bg-light border-bottom">
      <div className="container">
        <NavLink className="navbar-brand fw-bold" to="/">TimeTravel</NavLink>

        <span className="ms-2 text-muted d-none d-md-inline">{pageTitle}</span>

        <button className="navbar-toggler ms-auto" type="button" data-bs-toggle="collapse" data-bs-target="#ttNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="ttNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {user && (
              <>
                <li className="nav-item">
                  <NavLink to="/capsules" className={({ isActive }) => 'nav-link' + (isActive ? ' active fw-semibold' : '')}>
                    Capsules
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/capsules/new" className={({ isActive }) => 'nav-link' + (isActive ? ' active fw-semibold' : '')}>
                    Create
                  </NavLink>
                </li>
              </>
            )}
          </ul>

          <div className="d-flex align-items-center gap-2">
            {loading ? (
              <span className="text-muted small">loading…</span>
            ) : user ? (
              <>
                <span className="text-muted small d-none d-sm-inline">{user.email}</span>
                <button className="btn btn-outline-secondary btn-sm" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={({ isActive }) => 'btn btn-outline-primary btn-sm' + (isActive ? ' active' : '')}>
                  Login
                </NavLink>
                <NavLink to="/register" className="btn btn-primary btn-sm">
                  Sign up
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}