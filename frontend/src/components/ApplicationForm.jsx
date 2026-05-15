import { useState, useEffect } from 'react'

const EMPTY = {
  company: '',
  role: '',
  status: 'Applied',
  appliedDate: new Date().toISOString().slice(0, 10),
  link: '',
  notes: '',
}

export default function ApplicationForm({ initial, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState(EMPTY)

  useEffect(() => {
    if (initial) {
      setForm({
        company: initial.company || '',
        role: initial.role || '',
        status: initial.status || 'Applied',
        appliedDate: initial.appliedDate
          ? new Date(initial.appliedDate).toISOString().slice(0, 10)
          : new Date().toISOString().slice(0, 10),
        link: initial.link || '',
        notes: initial.notes || '',
      })
    } else {
      setForm(EMPTY)
    }
  }, [initial])

  const change = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    onSubmit({
      ...form,
      appliedDate: form.appliedDate ? new Date(form.appliedDate).toISOString() : new Date().toISOString(),
    })
  }

  return (
    <form onSubmit={submit}>
      <div style={row2}>
        <div>
          <label>Company *</label>
          <input value={form.company} onChange={change('company')} required autoFocus />
        </div>
        <div>
          <label>Role *</label>
          <input value={form.role} onChange={change('role')} required />
        </div>
      </div>

      <div style={row2}>
        <div>
          <label>Status</label>
          <select value={form.status} onChange={change('status')}>
            <option>Applied</option>
            <option>Interview</option>
            <option>Offer</option>
            <option>Rejected</option>
          </select>
        </div>
        <div>
          <label>Applied Date</label>
          <input type="date" value={form.appliedDate} onChange={change('appliedDate')} />
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>Link</label>
        <input
          type="url"
          value={form.link}
          onChange={change('link')}
          placeholder="https://…"
        />
      </div>

      <div style={{ marginBottom: '1.25rem' }}>
        <label>Notes</label>
        <textarea value={form.notes} onChange={change('notes')} placeholder="Anything to remember…" />
      </div>

      <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'flex-end' }}>
        <button type="button" onClick={onCancel} disabled={submitting}>Cancel</button>
        <button type="submit" className="primary" disabled={submitting}>
          {submitting ? 'Saving…' : initial ? 'Save Changes' : 'Add Application'}
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
