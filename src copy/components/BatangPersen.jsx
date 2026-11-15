// Batang tipis di bawah angka persentase. Hanya hiasan data: angkanya sudah tertulis.
// Panjang diatur lewat transform (komposit saja), bukan width, supaya tidak memicu layout.
export default function BatangPersen({ nilai, className = '' }) {
  const lebar = Math.max(0, Math.min(100, Number(nilai) || 0))
  return (
    <div className={`batang ${className}`} aria-hidden="true">
      <i style={{ transform: `translateX(${lebar - 100}%)` }} />
    </div>
  )
}
