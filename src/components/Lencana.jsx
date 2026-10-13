const WARNA = {
  netral: 'bg-slate-100 text-slate-700',
  teal: 'bg-teal-50 text-teal-800',
  amber: 'bg-amber-50 text-amber-800 ring-1 ring-amber-200',
  merah: 'bg-rose-50 text-rose-700',
}

export default function Lencana({ warna = 'netral', children }) {
  return (
    <span className={`inline-flex max-w-full items-center rounded-full px-2 py-0.5 text-xs font-medium ${WARNA[warna]}`}>
      {children}
    </span>
  )
}
