import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        <Link to="/" style={styles.brand}>
          <span style={styles.logo}>📋</span>
          <span>InternTrack</span>
        </Link>

        {user && (
          <div style={styles.links}>
            <Link to="/" style={{ ...styles.link, ...(isActive('/') ? styles.linkActive : {}) }}>
              Dashboard
            </Link>
            <Link to="/interviews" style={{ ...styles.link, ...(isActive('/interviews') ? styles.linkActive : {}) }}>
              Interviews
            </Link>
            <div style={styles.user}>
              <span style={styles.userName}>{user.name}</span>
              <button className="ghost" onClick={handleLogout} style={{ padding: '0.4em 0.8em' }}>
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    background: 'var(--bg-elev)',
    borderBottom: '1px solid var(--border)',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  inner: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '0.9rem 1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    fontWeight: 700,
    fontSize: '1.1rem',
    color: 'var(--text)',
  },
  logo: { fontSize: '1.3rem' },
  links: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  link: {
    padding: '0.5em 0.9em',
    borderRadius: 8,
    color: 'var(--text-dim)',
    fontSize: '0.92rem',
    fontWeight: 500,
  },
  linkActive: {
    color: 'var(--text)',
    background: 'var(--bg-elev-2)',
  },
  user: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.7rem',
    marginLeft: '1rem',
    paddingLeft: '1rem',
    borderLeft: '1px solid var(--border)',
  },
  userName: {
    color: 'var(--text-dim)',
    fontSize: '0.88rem',
  },
}
