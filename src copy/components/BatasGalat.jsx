import { Component } from 'react'

// Menangkap error saat render supaya layar tidak kosong.
// `penuh`: dipakai di akar aplikasi. Tanpa `penuh`: dipakai di area konten (navigasi tetap tampil).
// `resetKey`: bila berubah (mis. pindah halaman), tampilan galat dibersihkan otomatis.
export default class BatasGalat extends Component {
  state = { galat: null }

  static getDerivedStateFromError(galat) {
    return { galat }
  }

  componentDidCatch(galat, info) {
    console.error(galat, info)
  }

  componentDidUpdate(prev) {
    if (this.state.galat && prev.resetKey !== this.props.resetKey) {
      this.setState({ galat: null })
    }
  }

  render() {
    if (!this.state.galat) return this.props.children
    const { penuh } = this.props
    return (
      <div
        role="alert"
        style={{
          maxWidth: 480,
          margin: penuh ? '15vh auto 0' : '10vh auto 0',
          padding: 24,
          textAlign: 'center',
          fontFamily: 'system-ui, sans-serif',
          color: '#1F1D1A',
        }}
      >
        <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>Ada yang tidak beres</h1>
        <p style={{ marginTop: 8, color: '#5B574F' }}>
          Halaman ini gagal ditampilkan. Coba muat ulang, atau kembali ke beranda.
        </p>
        <div style={{ marginTop: 16, display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{ minHeight: 44, padding: '0 16px', borderRadius: 8, border: '1px solid #1F1D1A', background: '#1F1D1A', color: '#fff', fontSize: 16, fontWeight: 600 }}
          >
            Muat ulang
          </button>
          <a
            href="#/"
            onClick={() => this.setState({ galat: null })}
            style={{ display: 'inline-flex', alignItems: 'center', minHeight: 44, padding: '0 16px', borderRadius: 8, border: '1px solid #E4DFD4', color: '#1F1D1A', textDecoration: 'none', fontSize: 16 }}
          >
            Ke beranda
          </a>
        </div>
      </div>
    )
  }
}