import {
  Archive, ArrowLeft, Check, ArrowRight, Asterisk, Bath, BedDouble, BookOpen, BriefcaseBusiness, Building2, Car, ChevronDown,
  Coffee, CookingPot, DoorOpen, GraduationCap, Heart, House, Info, KeyRound, Laptop, ListFilter, LockKeyhole, MapPin,
  Plug, Printer, RotateCcw, Search, Snowflake, Star, Toilet, TreePalm, TreePine, Users, WashingMachine, Wifi, WifiOff, X, Zap,
} from 'lucide-react'

// Semua ikon memakai lucide-react. Nama ekspor (Ikon.Rumah, dst.) tidak berubah supaya halaman lain tetap sama.
const buat = (Komponen, tetap = {}) =>
  function IkonLucide({ size = 24, strokeWidth = 1.75, className = '', ...sisa }) {
    return <Komponen size={size} strokeWidth={strokeWidth} className={className} aria-hidden="true" {...tetap} {...sisa} />
  }

export const Ikon = {
  Rumah: buat(House),
  Kerja: buat(BriefcaseBusiness),
  Hati: buat(Heart),
  HatiIsi: buat(Heart, { fill: 'currentColor' }),
  Cari: buat(Search),
  Pin: buat(MapPin),
  Wifi: buat(Wifi),
  WifiOff: buat(WifiOff),
  Kopi: buat(Coffee),
  Laptop: buat(Laptop),
  Gedung: buat(Building2),
  Buku: buat(BookOpen),
  TempatTidur: buat(BedDouble),
  Pintu: buat(DoorOpen),
  Kunci: buat(KeyRound),
  Villa: buat(TreePalm),
  Filter: buat(ListFilter),
  Tutup: buat(X),
  Kiri: buat(ArrowLeft),
  Bintang: buat(Star),
  BintangIsi: buat(Star, { fill: 'currentColor' }),
  Colokan: buat(Plug),
  Salju: buat(Snowflake),
  Mobil: buat(Car),
  Pohon: buat(TreePine),
  Mandi: buat(Bath),
  Dapur: buat(CookingPot),
  Listrik: buat(Zap),
  Info: buat(Info),
  Ulang: buat(RotateCcw),
  Toilet: buat(Toilet),
  Printer: buat(Printer),
  Loker: buat(LockKeyhole),
  Meeting: buat(Users),
  Laundry: buat(WashingMachine),
  Bawah: buat(ChevronDown),
  Panah: buat(ArrowRight),
  Kampus: buat(GraduationCap),
  Centang: buat(Check),
  Bintik: buat(Asterisk),
  Arsip: buat(Archive),
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
