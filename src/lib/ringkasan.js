// Ringkasan teks filter yang sedang aktif (hanya tampilan; tidak memengaruhi hasil).
import { CHECKLIST, PILIHAN_ANGGARAN, bacaAnggaranTeks } from './pencarian.js'
import { LABEL_LOKASI, LABEL_TIPE, rupiah } from './format.js'

export function ringkasanFilter(modul, status) {
  const out = []
  if (status.lokasi !== 'semua') out.push(LABEL_LOKASI[status.lokasi] ?? status.lokasi)
  if (status.jenis !== 'semua') out.push(LABEL_TIPE[status.jenis] ?? status.jenis)
  if (status.anggaran === 'ketik') {
    const b = bacaAnggaranTeks(status.anggaranTeks)
    if (b.status === 'ok') out.push(`Maks ${rupiah(b.nilai)}`)
  } else if (status.anggaran !== 'semua') {
    const p = PILIHAN_ANGGARAN[modul]?.find((x) => x.id === status.anggaran)
    if (p) out.push(p.label)
  }
  for (const butir of status.checklist) {
    const c = CHECKLIST[modul]?.find(([k]) => k === butir)
    out.push(c ? c[1] : butir)
  }
  return out
}
