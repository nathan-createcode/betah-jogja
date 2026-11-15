// Pengisi kartu besar: tipografi "BETAH JOGJA" miring berulang. Hanya hiasan (aria-hidden).
// Induknya harus `isolasi` (relative, overflow hidden); isi kartu diberi kelas `lapis`.
const BARIS = 'BETAH JOGJA BETAH JOGJA BETAH JOGJA BETAH JOGJA'

export default function PolaBetah({ warna = 'currentColor', opasitas = 0.08, baris = 7 }) {
  return (
    <div className="pola" style={{ '--pola': warna, '--pola-opasitas': opasitas }} aria-hidden="true" data-pola>
      {Array.from({ length: baris }, (_, i) => (
        <span key={i} data-pola-baris style={{ marginLeft: i % 2 ? '-14%' : '-3%' }}>{BARIS}</span>
      ))}
    </div>
  )
}
