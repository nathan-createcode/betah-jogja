// Memuat CSV simulasi (milik pengguna) sebagai fixture uji.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import Papa from 'papaparse'
import { ubahTempat, ubahKriteria, ubahKonfigurasi } from '../../src/lib/repo.js'

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'fixtures')

export function bacaCsv(nama, dinamis = true) {
  const teks = fs.readFileSync(path.join(dir, nama), 'utf8')
  return Papa.parse(teks, { header: true, dynamicTyping: dinamis, skipEmptyLines: true }).data
    .map((b) => Object.fromEntries(Object.entries(b).map(([k, v]) => [k, v === '' ? null : v])))
}

export function muatFixture() {
  const barisTempat = bacaCsv('tempat.csv')
  const barisKriteria = bacaCsv('kriteria.csv')
  return {
    barisTempat,
    barisKriteria,
    barisKonfigurasi: bacaCsv('konfigurasi.csv', false),
    tempat: {
      CW: barisTempat.filter((t) => t.modul === 'CW').map(ubahTempat),
      LS: barisTempat.filter((t) => t.modul === 'LS').map(ubahTempat),
    },
    kriteria: {
      CW: ubahKriteria(barisKriteria.filter((k) => k.modul === 'CW').sort((a, b) => a.urutan - b.urutan), 'CW'),
      LS: ubahKriteria(barisKriteria.filter((k) => k.modul === 'LS').sort((a, b) => a.urutan - b.urutan), 'LS'),
    },
    konfigurasi: ubahKonfigurasi(bacaCsv('konfigurasi.csv', false)),
  }
}
