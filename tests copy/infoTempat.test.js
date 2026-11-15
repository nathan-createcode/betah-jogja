import { describe, it, expect } from 'vitest'
import { fasilitasUntukChip, infoKapasitas, susunInfo, teksPembaruan } from '../src/lib/infoTempat.js'

const kafe = {
  modul: 'CW', tipe_tempat: 'kafe', kapasitas: 42, jam_operasional: 'Setiap hari 09.00-23.00',
  jumlah_colokan: 'banyak', fasilitasList: ['Wi-Fi', 'colokan banyak', 'AC'],
  sumber_data: 'Data simulasi', tanggal_pembaruan: '2026-08-18',
}
const rumah = {
  modul: 'LS', tipe_tempat: 'rumah_sewa', kapasitas: 4, internet_mbps: 168, fasilitasList: ['Wi-Fi'],
  sumber_data: 'Data simulasi', tanggal_pembaruan: '2026-09-12',
}
const kos = { ...rumah, tipe_tempat: 'kos', kapasitas: 9, internet_mbps: 76 }

describe('susunInfo', () => {
  it('tempat kerja: jam, kapasitas, colokan; tanpa kecepatan internet', () => {
    expect(susunInfo(kafe).map((r) => r.id)).toEqual(['jam', 'kapasitas', 'colokan'])
  })
  it('tempat tinggal: kapasitas dan perkiraan internet', () => {
    expect(susunInfo(rumah).map((r) => r.id)).toEqual(['kapasitas', 'internet'])
    expect(susunInfo(rumah)[1].nilai).toBe('± 168 Mbps')
  })
  it('melewati data yang kosong', () => {
    expect(susunInfo({ ...rumah, internet_mbps: null }).map((r) => r.id)).toEqual(['kapasitas'])
  })
})

describe('infoKapasitas', () => {
  it('satuan mengikuti jenis tempat', () => {
    expect(infoKapasitas(kos).nilai).toBe('9 kamar')
    expect(infoKapasitas(rumah).nilai).toBe('4 orang')
    expect(infoKapasitas(kafe).nilai).toBe('42 orang')
  })
})

describe('fasilitasUntukChip', () => {
  it('menyembunyikan chip colokan yang sudah punya baris', () => {
    expect(fasilitasUntukChip(kafe)).toEqual(['Wi-Fi', 'AC'])
    expect(fasilitasUntukChip(rumah)).toEqual(['Wi-Fi'])
  })
})

describe('teksPembaruan', () => {
  it('menggabungkan sumber dan tanggal dalam satu baris', () => {
    expect(teksPembaruan(rumah)).toBe('Data simulasi · Diperbarui 12 September 2026')
  })
})
