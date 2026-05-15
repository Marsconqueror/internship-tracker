const COLORS = {
  Applied:   { bg: 'var(--info-soft)',    fg: 'var(--info)' },
  Interview: { bg: 'var(--warning-soft)', fg: 'var(--warning)' },
  Offer:     { bg: 'var(--success-soft)', fg: 'var(--success)' },
  Rejected:  { bg: 'var(--danger-soft)',  fg: 'var(--danger)' },
  Pending:   { bg: 'var(--info-soft)',    fg: 'var(--info)' },
  Passed:    { bg: 'var(--success-soft)', fg: 'var(--success)' },
  Failed:    { bg: 'var(--danger-soft)',  fg: 'var(--danger)' },
}

export default function StatusBadge({ value }) {
  const c = COLORS[value] || { bg: 'var(--bg-elev-2)', fg: 'var(--text-dim)' }
  return (
    <span style={{
      display: 'inline-block',
      padding: '0.25em 0.7em',
      borderRadius: 999,
      fontSize: '0.78rem',
      fontWeight: 600,
      background: c.bg,
      color: c.fg,
    }}>
      {value}
    </span>
  )
}
