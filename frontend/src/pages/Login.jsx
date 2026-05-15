import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setErr('')
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', { email, password })
      login(data.token, data.user)
      navigate('/')
    } catch (e) {
      setErr(e.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logo}>📋</div>
          <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Welcome back</h1>
          <p style={styles.subtitle}>Log in to track your internship applications</p>
        </div>

        <form onSubmit={submit}>
          <div style={{ marginBottom: '1rem' }}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoFocus
            />
          </div>
          <div style={{ marginBottom: '1.25rem' }}>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {err && <div style={styles.error}>{err}</div>}

          <button type="submit" className="primary" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Logging in…' : 'Log In'}
          </button>
        </form>

        <div style={styles.footer}>
          New here? <Link to="/register">Create an account</Link>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1.5rem',
    background:
      'radial-gradient(ellipse at top, rgba(99,102,241,0.08), transparent 60%), var(--bg)',
  },
  card: {
    width: '100%',
    maxWidth: 400,
    background: 'var(--bg-elev)',
    border: '1px solid var(--border)',
    borderRadius: 14,
    padding: '2rem',
  },
  header: { textAlign: 'center', marginBottom: '1.5rem' },
  logo: { fontSize: '2rem', marginBottom: '0.5rem' },
  subtitle: { color: 'var(--text-dim)', fontSize: '0.9rem', margin: '0.3rem 0 0' },
  error: {
    background: 'var(--danger-soft)',
    color: 'var(--danger)',
    padding: '0.6em 0.8em',
    borderRadius: 8,
    fontSize: '0.88rem',
    marginBottom: '1rem',
  },
  footer: {
    textAlign: 'center',
    marginTop: '1.25rem',
    fontSize: '0.88rem',
    color: 'var(--text-dim)',
  },
}
