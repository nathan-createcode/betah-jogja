import { Ikon } from './Ikon.jsx'

export function KeadaanKosong({ pesan, tombolRp, onNaikkan }) {
  return (
    <div className="kartu p-6">
      <p className="text-[16px] text-[var(--text-main)]">{pesan}</p>
      {tombolRp != null && (
        <button type="button" onClick={onNaikkan} className="tombol-utama mt-4">
          Naikkan ke Rp {new Intl.NumberFormat('id-ID').format(tombolRp)}
        </button>
      )}
    </div>
  )
}

export function KeadaanGalat({ pesan, onCoba }) {
  return (
    <div className="kartu p-6" role="alert">
      <p className="text-[16px] font-semibold text-[var(--text-main)]">Data belum bisa dimuat.</p>
      <p className="mt-2 text-[14px] text-[var(--text-secondary)]">{pesan}</p>
      <button type="button" onClick={onCoba} className="tombol-utama mt-4 gap-2">
        <Ikon.Ulang size={18} />
        Coba lagi
      </button>
    </div>
  )
}

export function KeadaanPembanding() {
  return (
    <div className="kartu p-4">
      <p className="text-[16px] font-semibold text-[var(--text-main)]">Pembanding tidak cukup</p>
      <p className="mt-1 text-[14px] text-[var(--text-secondary)]">
        Persentase kecocokan tampil bila ada cukup tempat untuk dibandingkan.
      </p>
    </div>
  )
}

export function KerangkaKartu() {
  return (
    <div className="kartu grid grid-cols-[112px_1fr] gap-4 p-3 sm:grid-cols-[168px_1fr_152px] sm:p-4">
      <div className="kerangka aspect-[4/3]" />
      <div className="space-y-3">
        <div className="kerangka h-6 w-3/4" />
        <div className="kerangka h-4 w-1/2" />
        <div className="kerangka h-4 w-full" />
      </div>
      <div className="kerangka col-span-2 h-10 sm:col-span-1 sm:h-14" />
    </div>
  )
}

export function KerangkaHalaman({ kartu = 4 }) {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Memuat">
      {Array.from({ length: kartu }, (_, i) => <KerangkaKartu key={i} />)}
    </div>
  )
}
