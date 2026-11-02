function Svg({ size = 24, strokeWidth = 1.75, className = '', ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...props}
    />
  )
}

export const Ikon = {
  Rumah: (p) => (
    <Svg {...p}><path d="M3 10.5 12 3l9 7.5" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" /></Svg>
  ),
  Kerja: (p) => (
    <Svg {...p}><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M3 13h18" /></Svg>
  ),
  Hati: (p) => (
    <Svg {...p}><path d="M19.5 5.5a5 5 0 0 0-7.5 0L12 5.9l-.05-.4a5 5 0 0 0-7.45 0 5.2 5.2 0 0 0 0 7.3L12 21l7.5-8.2a5.2 5.2 0 0 0 0-7.3z" /></Svg>
  ),
  HatiIsi: (p) => (
    <Svg {...p} fill="currentColor" stroke="currentColor">
      <path d="M19.5 5.5a5 5 0 0 0-7.5 0L12 5.9l-.05-.4a5 5 0 0 0-7.45 0 5.2 5.2 0 0 0 0 7.3L12 21l7.5-8.2a5.2 5.2 0 0 0 0-7.3z" />
    </Svg>
  ),
  Cari: (p) => (
    <Svg {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3-3" /></Svg>
  ),
  Pin: (p) => (
    <Svg {...p}><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></Svg>
  ),
  Wifi: (p) => (
    <Svg {...p}><path d="M5 12.5a10 10 0 0 1 14 0" /><path d="M8.5 16a5.5 5.5 0 0 1 7 0" /><path d="M12 20h.01" /></Svg>
  ),
  WifiOff: (p) => (
    <Svg {...p}><path d="M5 12.5a10 10 0 0 1 5-2.4" /><path d="M8.5 16a5.5 5.5 0 0 1 3-.8" /><path d="M12 20h.01" /><path d="m3 3 18 18" /><path d="M16.5 8.2A10 10 0 0 1 19 12.5" /></Svg>
  ),
  Kopi: (p) => (
    <Svg {...p}><path d="M4 8h12v7a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8z" /><path d="M16 9h1.5a3.5 3.5 0 0 1 0 7H16" /><path d="M8 2v2" /><path d="M12 2v2" /></Svg>
  ),
  Laptop: (p) => (
    <Svg {...p}><rect x="4" y="5" width="16" height="11" rx="1.5" /><path d="M2 19h20" /></Svg>
  ),
  Gedung: (p) => (
    <Svg {...p}><path d="M4 21V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16" /><path d="M14 9h5a1 1 0 0 1 1 1v11" /><path d="M8 8h.01M8 12h.01M8 16h.01M12 8h.01M12 12h.01M12 16h.01" /></Svg>
  ),
  Buku: (p) => (
    <Svg {...p}><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" /><path d="M6 3v16" /></Svg>
  ),
  TempatTidur: (p) => (
    <Svg {...p}><path d="M3 18v-5a3 3 0 0 1 3-3h13v8" /><path d="M3 18h18" /><path d="M3 10V6h6v4" /></Svg>
  ),
  Pintu: (p) => (
    <Svg {...p}><path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" /><path d="M14 12h.01" /><path d="M4 21h16" /></Svg>
  ),
  Kunci: (p) => (
    <Svg {...p}><circle cx="8" cy="15" r="4" /><path d="m11 12 8-8" /><path d="m16 4 3 3" /></Svg>
  ),
  Villa: (p) => (
    <Svg {...p}><path d="M3 11 12 3l9 8" /><path d="M5 10v10h14V10" /><path d="M9 20v-6h6v6" /><path d="M12 3v3" /></Svg>
  ),
  Filter: (p) => (
    <Svg {...p}><path d="M4 5h16l-6 7v6l-4 2v-8z" /></Svg>
  ),
  Tutup: (p) => (
    <Svg {...p}><path d="M6 6l12 12M18 6 6 18" /></Svg>
  ),
  Kiri: (p) => (
    <Svg {...p}><path d="M15 6 9 12l6 6" /></Svg>
  ),
  Bintang: (p) => (
    <Svg {...p}><path d="M12 3.2 14.6 9l6.4.6-4.8 4.2 1.5 6.2L12 16.8 6.3 20l1.5-6.2L3 9.6 9.4 9z" /></Svg>
  ),
  Colokan: (p) => (
    <Svg {...p}><path d="M9 7v4M15 7v4" /><path d="M6 11h12v3a6 6 0 0 1-12 0z" /><path d="M12 20v-3" /></Svg>
  ),
  Salju: (p) => (
    <Svg {...p}><path d="M12 2v20M5 6.5 19 17.5M19 6.5 5 17.5" /></Svg>
  ),
  Mobil: (p) => (
    <Svg {...p}><path d="M4 16v-3l2.5-5h11L20 13v3" /><path d="M4 16h16" /><circle cx="7.5" cy="16" r="1.5" /><circle cx="16.5" cy="16" r="1.5" /></Svg>
  ),
  Pohon: (p) => (
    <Svg {...p}><path d="M12 22V12" /><path d="M12 12 7 8l5-6 5 6-5 4" /><path d="M8 14h8l-4 5z" /></Svg>
  ),
  Mandi: (p) => (
    <Svg {...p}><path d="M4 13h16v2a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z" /><path d="M6 13V6a2 2 0 0 1 2-2h0" /></Svg>
  ),
  Dapur: (p) => (
    <Svg {...p}><path d="M4 11h16v9H4z" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></Svg>
  ),
  Listrik: (p) => (
    <Svg {...p}><path d="M13 2 4 14h7l-1 8 9-12h-7z" /></Svg>
  ),
  Info: (p) => (
    <Svg {...p}><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 8h.01" /></Svg>
  ),
  Ulang: (p) => (
    <Svg {...p}><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5" /></Svg>
  ),
  Toilet: (p) => (
    <Svg {...p}><path d="M8 3h8v5H8z" /><path d="M5 11h14v1a7 7 0 0 1-14 0z" /><path d="M10 19v2h4v-2" /></Svg>
  ),
  Printer: (p) => (
    <Svg {...p}><path d="M7 9V4h10v5" /><rect x="4" y="9" width="16" height="8" rx="2" /><path d="M7 14h10v6H7z" /></Svg>
  ),
  Loker: (p) => (
    <Svg {...p}><rect x="5" y="3" width="14" height="18" rx="1.5" /><path d="M12 3v18M9.5 12h.01M14.5 12h.01" /></Svg>
  ),
  Meeting: (p) => (
    <Svg {...p}><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0 1 12 0" /><circle cx="17" cy="9" r="2.5" /><path d="M16 14.2A5 5 0 0 1 21 19" /></Svg>
  ),
  Laundry: (p) => (
    <Svg {...p}><rect x="4" y="3" width="16" height="18" rx="2" /><circle cx="12" cy="13" r="4" /><path d="M7.5 6.5h.01M10.5 6.5h.01" /></Svg>
  ),
  Bawah: (p) => (
    <Svg {...p}><path d="m6 9 6 6 6-6" /></Svg>
  ),
  Panah: (p) => (
    <Svg {...p}><path d="M5 12h14M13 6l6 6-6 6" /></Svg>
  ),
  BintangIsi: (p) => (
    <Svg {...p} fill="currentColor"><path d="M12 3.2 14.6 9l6.4.6-4.8 4.2 1.5 6.2L12 16.8 6.3 20l1.5-6.2L3 9.6 9.4 9z" /></Svg>
  ),
}

export function ikonTipe(tipe) {
  const peta = {
    kafe: Ikon.Kopi,
    coworking: Ikon.Laptop,
    ruang_publik: Ikon.Buku,
    kos: Ikon.TempatTidur,
    rumah_sewa: Ikon.Rumah,
    villa: Ikon.Villa,
    guesthouse: Ikon.Kunci,
  }
  return peta[tipe] ?? Ikon.Pin
}

export function ikonFasilitas(nama) {
  const n = String(nama).toLowerCase()
  if (n.includes('wi-fi') || n.includes('wifi')) return Ikon.Wifi
  if (n.includes('colokan')) return Ikon.Colokan
  if (n === 'ac' || n.split(/[\s/]+/).includes('ac')) return Ikon.Salju
  if (n.includes('parkir')) return Ikon.Mobil
  if (n.includes('outdoor')) return Ikon.Pohon
  if (n.includes('kamar mandi')) return Ikon.Mandi
  if (n.includes('dapur')) return Ikon.Dapur
  if (n.includes('listrik')) return Ikon.Listrik
  if (n.includes('mushola')) return Ikon.Gedung
  if (n.includes('toilet')) return Ikon.Toilet
  if (n.includes('printer')) return Ikon.Printer
  if (n.includes('loker')) return Ikon.Loker
  if (n.includes('meeting')) return Ikon.Meeting
  if (n.includes('laundry')) return Ikon.Laundry
  return Ikon.Info
}
