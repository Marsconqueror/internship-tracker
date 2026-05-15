import { useState, useEffect } from 'react'

function toDatetimeLocal(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function InterviewForm({ initial, applications, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState({
    application: '',
    round: 'Round 1',
    scheduledAt: '',
    mode: 'Online',
    outcome: 'Pending',
    notes: '',
  })

  useEffect(() => {
    if (initial) {
      setForm({
        application: initial.application?._id || initial.application || '',
        round: initial.round || 'Round 1',
        scheduledAt: toDatetimeLocal(initial.scheduledAt),
        mode: initial.mode || 'Online',
        outcome: initial.outcome || 'Pending',
        notes: initial.notes || '',
      })
    } else {
      setForm({
        application: applications[0]?._id || '',
        round: 'Round 1',
        scheduledAt: toDatetimeLocal(new Date().toISOString()),
        mode: 'Online',
        outcome: 'Pending',
        notes: '',
      })
    }
  }, [initial, applications])

  const change = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    if (!form.application) {
      alert('Please select an application first.')
      return
    }
    onSubmit({
      ...form,
      scheduledAt: new Date(form.scheduledAt).toISOString(),
    })
  }

  return (
    <form onSubmit={submit}>
      <div style={{ marginBottom: '1rem' }}>
        <label>Application *</label>
        <select value={form.application} onChange={change('application')} required>
          <option value="">— Select —</option>
          {applications.map((a) => (
            <option key={a._id} value={a._id}>{a.company} — {a.role}</option>
          ))}
        </select>
      </div>

      <div style={row2}>
        <div>
          <label>Round</label>
          <input value={form.round} onChange={change('round')} placeholder="e.g. Technical 1" />
        </div>
        <div>
          <label>Mode</label>
          <select value={form.mode} onChange={change('mode')}>
            <option>Online</option>
            <option>In-person</option>
            <option>Phone</option>
          </select>
        </div>
      </div>

      <div style={row2}>
        <div>
          <label>Scheduled At *</label>
          <input type="datetime-local" value={form.scheduledAt} onChange={change('scheduledAt')} required />
        </div>
        <div>
          <label>Outcome</label>
          <select value={form.outcome} onChange={change('outcome')}>
            <option>Pending</option>
            <option>Passed</option>
            <option>Failed</option>
          </select>
        </div>
      </div>

      <div style={{ marginBottom: '1.25rem' }}>
        <label>Notes</label>
        <textarea value={form.notes} onChange={change('notes')} placeholder="Prep notes, interviewer name, etc." />
      </div>

      <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'flex-end' }}>
        <button type="button" onClick={onCancel} disabled={submitting}>Cancel</button>
        <button type="submit" className="primary" disabled={submitting}>
          {submitting ? 'Saving…' : initial ? 'Save Changes' : 'Add Interview'}
        </button>
      </div>
    </form>
  )
}

const row2 = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '0.8rem',
  marginBottom: '1rem',
}
