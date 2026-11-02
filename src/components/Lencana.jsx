export default function Lencana({ warna = 'netral', children }) {
  const gaya = {
    netral: { background: 'var(--bg-muted)', color: 'var(--text-secondary)' },
    aksen: { background: 'var(--aksen-surface)', color: 'var(--aksen)' },
    simulasi: { background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-light)' },
  }
  return (
    <span
      className="inline-flex max-w-full items-center rounded-md px-2 py-0.5 text-[12px] font-medium"
      style={gaya[warna] ?? gaya.netral}
    >
      {children}
    </span>
  )
}
