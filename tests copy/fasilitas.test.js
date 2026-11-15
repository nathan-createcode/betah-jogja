import { describe, it, expect } from 'vitest'
import { pecahFasilitas, punyaButir } from '../src/lib/fasilitas.js'

describe('pecahFasilitas', () => {
  it('memisahkan butir dan merapikan spasi tepi', () => {
    expect(pecahFasilitas('Wi-Fi, AC,  mushola ')).toEqual(['Wi-Fi', 'AC', 'mushola'])
  })
  it('mengabaikan butir kosong dan masukan bukan teks', () => {
    expect(pecahFasilitas('Wi-Fi,, ,AC')).toEqual(['Wi-Fi', 'AC'])
    expect(pecahFasilitas(null)).toEqual([])
    expect(pecahFasilitas(undefined)).toEqual([])
  })
})

describe('punyaButir', () => {
  const daftar = pecahFasilitas('Wi-Fi, colokan banyak, AC')
  it('mencocokkan tanpa membedakan huruf besar dan kecil', () => {
    expect(punyaButir(daftar, 'wi-fi')).toBe(true)
    expect(punyaButir(daftar, 'COLOKAN BANYAK')).toBe(true)
    expect(punyaButir(daftar, ' ac ')).toBe(true)
  })
  it('mencocokkan butir utuh, bukan sebagian', () => {
    expect(punyaButir(daftar, 'colokan')).toBe(false)
    expect(punyaButir(daftar, 'parkir')).toBe(false)
  })
})
