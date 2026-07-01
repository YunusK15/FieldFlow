import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    setMenuOpen(false)
    navigate('/')
  }

  const NAV_LINKS = [
    { to: '/', label: 'Home' },
    { to: '/technologies', label: 'Technologies' },
    { to: '/detect', label: 'Pest Detection' },
    ...(user ? [
      { to: '/history', label: 'History' },
      { to: '/analytics', label: 'Analytics' }
    ] : []),
    { to: '/about', label: 'About' },
  ]

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <svg className="w-7 h-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>FieldFlow</span>
        </Link>

        {/* Desktop links */}
        <div className="navbar-links">
          {NAV_LINKS.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
            >
              {link.label}
            </NavLink>
          ))}

          {/* Auth buttons */}
          {user ? (
            <div className="navbar-user-section">
              <div className="navbar-user-badge">
                <div className="navbar-avatar">{user.name?.charAt(0)?.toUpperCase() || '?'}</div>
                <span className="navbar-username">{user.name?.split(' ')[0]}</span>
              </div>
              <button onClick={handleLogout} className="navbar-link navbar-logout-btn" title="Sign out">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          ) : (
            <NavLink to="/login" className={({ isActive }) => `navbar-auth-btn ${isActive ? 'active' : ''}`}>
              Sign In
            </NavLink>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="navbar-toggle"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`navbar-mobile ${menuOpen ? 'open' : ''}`}>
        {NAV_LINKS.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) => `navbar-mobile-link ${isActive ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </NavLink>
        ))}
        {user ? (
          <>
            <div className="navbar-mobile-user">
              <div className="navbar-avatar">{user.name?.charAt(0)?.toUpperCase() || '?'}</div>
              <span className="text-gray-300 text-sm font-medium">{user.name}</span>
            </div>
            <button onClick={handleLogout} className="navbar-mobile-link" style={{ color: 'var(--danger)' }}>
              Sign Out
            </button>
          </>
        ) : (
          <NavLink
            to="/login"
            className={({ isActive }) => `navbar-mobile-link ${isActive ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            Sign In
          </NavLink>
        )}
      </div>
    </nav>
  )
}
