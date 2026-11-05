import { beforeEach, describe, expect, it, vi } from 'vitest'

const sisip = vi.fn(() => Promise.resolve({ error: null }))
const dari = vi.fn(() => ({ insert: sisip }))

vi.mock('../src/lib/supabase.js', () => ({ supabase: { from: dari } }))

function pasangPenyimpanan() {
  const buat = () => {
    const m = new Map()
    return {
      getItem: (k) => (m.has(k) ? m.get(k) : null),
      setItem: (k, v) => m.set(k, String(v)),
      removeItem: (k) => m.delete(k),
    }
  }
  vi.stubGlobal('localStorage', buat())
  vi.stubGlobal('sessionStorage', buat())
  vi.stubGlobal('window', { location: { hash: '#/tempat/12' }, innerWidth: 390 })
}

describe('catat (statistik anonim)', () => {
  beforeEach(() => {
    vi.resetModules()
    sisip.mockClear()
    dari.mockClear()
    pasangPenyimpanan()
  })

  it('ID pengunjung dibuat sekali lalu tetap sama', async () => {
    const { ambilVisitorId } = await import('../src/lib/catat.js')
    const a = ambilVisitorId()
    expect(a).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
    expect(ambilVisitorId()).toBe(a)
  })

  it('kode sesi 6 karakter huruf besar/angka dan konsisten', async () => {
    const { kodeSesi } = await import('../src/lib/catat.js')
    expect(kodeSesi()).toMatch(/^[0-9A-F]{6}$/)
    expect(kodeSesi()).toBe(kodeSesi())
  })

  it('mengirim baris yang benar ke tabel aktivitas', async () => {
    const { catat, ambilVisitorId } = await import('../src/lib/catat.js')
    catat('favorit_tambah', 7)
    expect(dari).toHaveBeenCalledWith('aktivitas')
    expect(sisip).toHaveBeenCalledWith({
      visitor_id: ambilVisitorId(),
      jenis: 'favorit_tambah',
      tempat_id: '7',
      path: '#/tempat/12',
      perangkat: 'mobile',
    })
  })

  it('kunjungan hanya dicatat sekali per sesi tab', async () => {
    const { catatKunjunganSekali } = await import('../src/lib/catat.js')
    catatKunjunganSekali()
    catatKunjunganSekali()
    expect(sisip).toHaveBeenCalledTimes(1)
    expect(sisip.mock.calls[0][0].jenis).toBe('kunjungan')
    expect(sisip.mock.calls[0][0].tempat_id).toBeNull()
  })

  it('kegagalan jaringan atau penyimpanan tidak melempar error', async () => {
    sisip.mockImplementationOnce(() => Promise.reject(new Error('offline')))
    vi.stubGlobal('localStorage', { getItem() { throw new Error('mati') }, setItem() { throw new Error('mati') } })
    const { catat } = await import('../src/lib/catat.js')
    expect(() => catat('kunjungan')).not.toThrow()
    await Promise.resolve()
  })
})
