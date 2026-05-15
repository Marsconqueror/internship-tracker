import { useEffect, useMemo, useState } from 'react'
import api from '../api/client'
import Modal from '../components/Modal'
import ApplicationForm from '../components/ApplicationForm'
import StatusBadge from '../components/StatusBadge'

const STATUSES = ['Applied', 'Interview', 'Offer', 'Rejected']

export default function Dashboard() {
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [err, setErr] = useState('')

  const load = async () => {
    setLoading(true)
    setErr('')
    try {
      const { data } = await api.get('/applications')
      setApps(data)
    } catch (e) {
      setErr(e.response?.data?.message || 'Failed to load applications')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const stats = useMemo(() => {
    const s = { total: apps.length, Applied: 0, Interview: 0, Offer: 0, Rejected: 0 }
    apps.forEach((a) => { s[a.status] = (s[a.status] || 0) + 1 })
    return s
  }, [apps])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return apps.filter((a) => {
      if (statusFilter !== 'All' && a.status !== statusFilter) return false
      if (!q) return true
      return (
        a.company.toLowerCase().includes(q) ||
        a.role.toLowerCase().includes(q) ||
        (a.notes && a.notes.toLowerCase().includes(q))
      )
    })
  }, [apps, search, statusFilter])

  const openAdd = () => { setEditing(null); setShowModal(true) }
  const openEdit = (app) => { setEditing(app); setShowModal(true) }
  const closeModal = () => { setShowModal(false); setEditing(null) }

  const save = async (payload) => {
    setSubmitting(true)
    try {
      if (editing) {
        const { data } = await api.put(`/applications/${editing._id}`, payload)
        setApps((prev) => prev.map((a) => (a._id === data._id ? data : a)))
      } else {
        const { data } = await api.post('/applications', payload)
        setApps((prev) => [data, ...prev])
      }
      closeModal()
    } catch (e) {
      alert(e.response?.data?.message || 'Save failed')
    } finally {
      setSubmitting(false)
    }
  }

  const remove = async (id) => {
    if (!confirm('Delete this application?')) return
    try {
      await api.delete(`/applications/${id}`)
      setApps((prev) => prev.filter((a) => a._id !== id))
    } catch (e) {
      alert(e.response?.data?.message || 'Delete failed')
    }
  }

  const quickStatusChange = async (app, status) => {
    try {
      const { data } = await api.put(`/applications/${app._id}`, { status })
      setApps((prev) => prev.map((a) => (a._id === data._id ? data : a)))
    } catch (e) {
      alert('Update failed')
    }
  }

  return (
    <div style={page}>
      <div style={header}>
        <div>
          <h1 style={{ fontSize: '1.6rem', marginBottom: '0.2rem' }}>Applications</h1>
          <p style={{ color: 'var(--text-dim)', margin: 0 }}>
            Track everything in one place.
          </p>
        </div>
        <button className="primary" onClick={openAdd}>+ New Application</button>
      </div>

      <div style={statsGrid}>
        <StatCard label="Total" value={stats.total} accent="var(--accent)" />
        <StatCard label="Applied" value={stats.Applied} accent="var(--info)" />
        <StatCard label="Interview" value={stats.Interview} accent="var(--warning)" />
        <StatCard label="Offer" value={stats.Offer} accent="var(--success)" />
        <StatCard label="Rejected" value={stats.Rejected} accent="var(--danger)" />
      </div>

      <div style={toolbar}>
        <input
          placeholder="Search company, role, notes…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 320 }}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ maxWidth: 180 }}>
          <option>All</option>
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      {err && <div style={errorBanner}>{err}</div>}

      <div style={tableWrap}>
        {loading ? (
          <div style={empty}>Loading…</div>
        ) : filtered.length === 0 ? (
          <div style={empty}>
            {apps.length === 0
              ? <>No applications yet. <button className="ghost" onClick={openAdd} style={{ padding: '0.2em 0.5em', textDecoration: 'underline' }}>Add your first one</button></>
              : 'No applications match your filters.'}
          </div>
        ) : (
          <table style={table}>
            <thead>
              <tr>
                <th style={th}>Company</th>
                <th style={th}>Role</th>
                <th style={th}>Status</th>
                <th style={th}>Applied</th>
                <th style={th}>Link</th>
                <th style={{ ...th, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((app) => (
                <tr key={app._id} style={tr}>
                  <td style={td}><strong>{app.company}</strong></td>
                  <td style={td}>{app.role}</td>
                  <td style={td}>
                    <select
                      value={app.status}
                      onChange={(e) => quickStatusChange(app, e.target.value)}
                      style={statusSelect}
                    >
                      {STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                  <td style={{ ...td, color: 'var(--text-dim)' }}>
                    {app.appliedDate ? new Date(app.appliedDate).toLocaleDateString() : '—'}
                  </td>
                  <td style={td}>
                    {app.link ? (
                      <a href={app.link} target="_blank" rel="noreferrer" style={{ fontSize: '0.85rem' }}>
                        Open ↗
                      </a>
                    ) : <span style={{ color: 'var(--text-faint)' }}>—</span>}
                  </td>
                  <td style={{ ...td, textAlign: 'right' }}>
                    <button className="ghost" onClick={() => openEdit(app)} style={{ padding: '0.3em 0.7em' }}>Edit</button>
                    <button className="ghost" onClick={() => remove(app._id)} style={{ padding: '0.3em 0.7em', color: 'var(--danger)' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={showModal} onClose={closeModal} title={editing ? 'Edit Application' : 'New Application'}>
        <ApplicationForm
          initial={editing}
          onSubmit={save}
          onCancel={closeModal}
          submitting={submitting}
        />
      </Modal>
    </div>
  )
}

function StatCard({ label, value, accent }) {
  return (
    <div style={{
      background: 'var(--bg-elev)',
      border: '1px solid var(--border)',
      borderRadius: 10,
      padding: '1rem 1.1rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, width: 3, height: '100%',
        background: accent,
      }} />
      <div style={{ color: 'var(--text-dim)', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {label}
      </div>
      <div style={{ fontSize: '1.6rem', fontWeight: 700, marginTop: '0.2rem' }}>{value}</div>
    </div>
  )
}

const page = { maxWidth: 1200, margin: '0 auto', padding: '2rem 1.5rem' }
const header = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '1.5rem',
  flexWrap: 'wrap',
  gap: '1rem',
}
const statsGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
  gap: '0.8rem',
  marginBottom: '1.5rem',
}
const toolbar = {
  display: 'flex',
  gap: '0.7rem',
  marginBottom: '1rem',
  flexWrap: 'wrap',
}
const errorBanner = {
  background: 'var(--danger-soft)',
  color: 'var(--danger)',
  padding: '0.7em 1em',
  borderRadius: 8,
  marginBottom: '1rem',
  fontSize: '0.9rem',
}
const tableWrap = {
  background: 'var(--bg-elev)',
  border: '1px solid var(--border)',
  borderRadius: 10,
  overflow: 'auto',
}
const table = { width: '100%', borderCollapse: 'collapse', minWidth: 700 }
const th = {
  textAlign: 'left',
  padding: '0.8em 1em',
  fontSize: '0.78rem',
  fontWeight: 600,
  color: 'var(--text-dim)',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  borderBottom: '1px solid var(--border)',
  background: 'var(--bg-elev-2)',
  position: 'sticky',
  top: 0,
}
const td = {
  padding: '0.85em 1em',
  borderBottom: '1px solid var(--border)',
  fontSize: '0.92rem',
  verticalAlign: 'middle',
}
const tr = {}
const statusSelect = {
  padding: '0.3em 0.6em',
  fontSize: '0.82rem',
  width: 'auto',
  minWidth: 110,
  background: 'var(--bg-elev-2)',
}
const empty = {
  padding: '3rem 1rem',
  textAlign: 'center',
  color: 'var(--text-dim)',
}
