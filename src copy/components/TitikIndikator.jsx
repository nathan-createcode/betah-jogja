export default function TitikIndikator({ nilai, maksimum = 5 }) {
  const n = Number(nilai) || 0
  return (
    <span className="inline-flex shrink-0 items-center gap-1" role="img" aria-label={`${n} dari ${maksimum}`}>
      {Array.from({ length: maksimum }, (_, i) => (
        <span
          key={i}
          className="h-2 w-2 rounded-full"
          style={{ background: i < n ? 'var(--aksen)' : 'var(--border-strong)', opacity: i < n ? 1 : 0.55 }}
        />
      ))}
    </span>
  )
}
