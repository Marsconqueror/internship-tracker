import { useEffect, useMemo, useState } from 'react'
import api from '../api/client'
import Modal from '../components/Modal'
import InterviewForm from '../components/InterviewForm'
import StatusBadge from '../components/StatusBadge'

export default function Interviews() {
  const [interviews, setInterviews] = useState([])
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [err, setErr] = useState('')

  const load = async () => {
    setLoading(true)
    setErr('')
    try {
      const [iRes, aRes] = await Promise.all([
        api.get('/interviews'),
        api.get('/applications'),
      ])
      setInterviews(iRes.data)
      setApps(aRes.data)
    } catch (e) {
      setErr(e.response?.data?.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const { upcoming, past } = useMemo(() => {
    const now = Date.now()
    const u = [], p = []
    interviews.forEach((i) => {
      if (new Date(i.scheduledAt).getTime() >= now) u.push(i)
      else p.push(i)
    })
    p.reverse() // most recent past first
    return { upcoming: u, past: p }
  }, [interviews])

  const openAdd = () => { setEditing(null); setShowModal(true) }
  const openEdit = (iv) => { setEditing(iv); setShowModal(true) }
  const closeModal = () => { setShowModal(false); setEditing(null) }

  const save = async (payload) => {
    setSubmitting(true)
    try {
      if (editing) {
        const { data } = await api.put(`/interviews/${editing._id}`, payload)
        setInterviews((prev) => prev.map((i) => (i._id === data._id ? data : i)))
      } else {
        const { data } = await api.post('/interviews', payload)
        setInterviews((prev) =>
          [...prev, data].sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt))
        )
      }
      closeModal()
    } catch (e) {
      alert(e.response?.data?.message || 'Save failed')
    } finally {
      setSubmitting(false)
    }
  }

  const remove = async (id) => {
    if (!confirm('Delete this interview?')) return
    try {
      await api.delete(`/interviews/${id}`)
      setInterviews((prev) => prev.filter((i) => i._id !== id))
    } catch (e) {
      alert('Delete failed')
    }
  }

  return (
    <div style={page}>
      <div style={header}>
        <div>
          <h1 style={{ fontSize: '1.6rem', marginBottom: '0.2rem' }}>Interviews</h1>
          <p style={{ color: 'var(--text-dim)', margin: 0 }}>
            Upcoming and past interviews tied to your applications.
          </p>
        </div>
        <button className="primary" onClick={openAdd} disabled={apps.length === 0}>
          + New Interview
        </button>
      </div>

      {err && <div style={errorBanner}>{err}</div>}

      {!loading && apps.length === 0 && (
        <div style={empty}>
          You need at least one application before scheduling an interview. Go to the Dashboard to add one.
        </div>
      )}

      {loading ? (
        <div style={empty}>Loading…</div>
      ) : (
        <>
          <Section title={`Upcoming (${upcoming.length})`}>
            {upcoming.length === 0
              ? <div style={empty}>No upcoming interviews.</div>
              : upcoming.map((iv) => (
                  <InterviewCard key={iv._id} iv={iv} onEdit={openEdit} onDelete={remove} />
                ))}
          </Section>

          {past.length > 0 && (
            <Section title={`Past (${past.length})`}>
              {past.map((iv) => (
                <InterviewCard key={iv._id} iv={iv} onEdit={openEdit} onDelete={remove} dim />
              ))}
            </Section>
          )}
        </>
      )}

      <Modal open={showModal} onClose={closeModal} title={editing ? 'Edit Interview' : 'New Interview'}>
        <InterviewForm
          initial={editing}
          applications={apps}
          onSubmit={save}
          onCancel={closeModal}
          submitting={submitting}
        />
      </Modal>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <h2 style={{ fontSize: '1rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.8rem' }}>
        {title}
      </h2>
      <div style={{ display: 'grid', gap: '0.7rem' }}>{children}</div>
    </div>
  )
}

function InterviewCard({ iv, onEdit, onDelete, dim }) {
  const date = new Date(iv.scheduledAt)
  const dateStr = date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
  const timeStr = date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })

  return (
    <div style={{ ...card, opacity: dim ? 0.7 : 1 }}>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flex: 1, minWidth: 0 }}>
        <div style={dateBox}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>
            {dateStr.split(',')[0]}
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>
            {date.getDate()}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
            {date.toLocaleDateString(undefined, { month: 'short' })}
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: '0.98rem' }}>
            {iv.application?.company || 'Unknown'} <span style={{ color: 'var(--text-dim)', fontWeight: 400 }}>· {iv.application?.role || ''}</span>
          </div>
          <div style={{ display: 'flex', gap: '0.7rem', alignItems: 'center', marginTop: '0.3rem', flexWrap: 'wrap' }}>
            <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>
              {iv.round} · {timeStr} · {iv.mode}
            </span>
            <StatusBadge value={iv.outcome} />
          </div>
          {iv.notes && (
            <div style={{ marginTop: '0.4rem', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
              {iv.notes}
            </div>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', gap: '0.3rem' }}>
        <button className="ghost" onClick={() => onEdit(iv)} style={{ padding: '0.3em 0.7em' }}>Edit</button>
        <button className="ghost" onClick={() => onDelete(iv._id)} style={{ padding: '0.3em 0.7em', color: 'var(--danger)' }}>Delete</button>
      </div>
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
const errorBanner = {
  background: 'var(--danger-soft)',
  color: 'var(--danger)',
  padding: '0.7em 1em',
  borderRadius: 8,
  marginBottom: '1rem',
  fontSize: '0.9rem',
}
const empty = {
  padding: '2rem 1rem',
  textAlign: 'center',
  color: 'var(--text-dim)',
  background: 'var(--bg-elev)',
  border: '1px solid var(--border)',
  borderRadius: 10,
}
const card = {
  background: 'var(--bg-elev)',
  border: '1px solid var(--border)',
  borderRadius: 10,
  padding: '0.9rem 1rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.8rem',
  flexWrap: 'wrap',
}
const dateBox = {
  background: 'var(--bg-elev-2)',
  border: '1px solid var(--border)',
  borderRadius: 8,
  padding: '0.5rem 0.7rem',
  textAlign: 'center',
  minWidth: 56,
}
