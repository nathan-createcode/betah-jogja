import { kelasAksen } from '../lib/teksSkor.js'

// Ilustrasi datar satu warna per tipe tempat. Tetap diberi label "Foto simulasi".
const S = { fill: 'none', stroke: 'currentColor', strokeLinecap: 'round' }
const TANAH = null // lantai digambar di FotoPlaceholder supaya selalu selebar bingkai

const ILUSTRASI = {
  kafe: (
    <>
      {TANAH}
      <rect x="14" y="16" width="46" height="52" rx="3" fill="currentColor" opacity=".14" />
      <path d="M37 16v52M14 42h46" {...S} strokeWidth="2" opacity=".25" />
      <path d="M118 0v28" {...S} strokeWidth="2" opacity=".5" />
      <path d="M108 42a10 10 0 0 1 20 0z" fill="currentColor" opacity=".55" />
      <rect x="48" y="80" width="76" height="6" rx="2" fill="currentColor" opacity=".85" />
      <path d="M58 86v28M114 86v28" {...S} strokeWidth="4" opacity=".55" />
      <path d="M78 62h24v12a8 8 0 0 1-8 8h-8a8 8 0 0 1-8-8z" fill="currentColor" opacity=".9" />
      <path d="M102 66h4a5 5 0 0 1 0 10h-4" {...S} strokeWidth="3" opacity=".9" />
      <path d="M85 54c-3-4 3-6 0-10M95 54c-3-4 3-6 0-10" {...S} strokeWidth="2.5" opacity=".5" />
    </>
  ),
  coworking: (
    <>
      {TANAH}
      <rect x="20" y="24" width="46" height="4" rx="2" fill="currentColor" opacity=".5" />
      <rect x="26" y="12" width="6" height="12" fill="currentColor" opacity=".6" />
      <rect x="34" y="15" width="6" height="9" fill="currentColor" opacity=".4" />
      <path d="M54 24c-6-3-8-9-6-13 6 0 8 6 6 13zM56 24c4-3 8-7 6-13-6 0-8 6-6 13z" fill="currentColor" opacity=".55" />
      <rect x="24" y="78" width="112" height="6" rx="2" fill="currentColor" opacity=".85" />
      <path d="M34 84v30M126 84v30" {...S} strokeWidth="4" opacity=".55" />
      <rect x="58" y="50" width="44" height="28" rx="3" fill="currentColor" opacity=".9" />
      <rect x="62" y="54" width="36" height="20" rx="1.5" fill="var(--aksen-surface)" />
      <path d="M52 78h56l-3 4H55z" fill="currentColor" opacity=".7" />
      <rect x="116" y="66" width="10" height="12" rx="2" fill="currentColor" opacity=".6" />
    </>
  ),
  ruang_publik: (
    <>
      {TANAH}
      <rect x="16" y="20" width="64" height="68" rx="3" fill="currentColor" opacity=".14" />
      <path d="M16 44h64M16 66h64" {...S} strokeWidth="2" opacity=".3" />
      <g fill="currentColor">
        <rect x="22" y="26" width="6" height="18" opacity=".8" /><rect x="30" y="30" width="7" height="14" opacity=".55" />
        <rect x="39" y="24" width="6" height="20" opacity=".8" /><rect x="47" y="29" width="8" height="15" opacity=".5" />
        <rect x="57" y="27" width="6" height="17" opacity=".75" /><rect x="65" y="31" width="7" height="13" opacity=".5" />
        <rect x="22" y="50" width="7" height="16" opacity=".55" /><rect x="31" y="46" width="6" height="20" opacity=".8" />
        <rect x="39" y="52" width="8" height="14" opacity=".5" /><rect x="49" y="48" width="6" height="18" opacity=".75" />
      </g>
      <rect x="92" y="76" width="52" height="6" rx="2" fill="currentColor" opacity=".85" />
      <rect x="92" y="60" width="52" height="5" rx="2" fill="currentColor" opacity=".55" />
      <path d="M98 65v11M138 65v11M98 82v26M138 82v26" {...S} strokeWidth="4" opacity=".55" />
    </>
  ),
  kos: (
    <>
      {TANAH}
      <rect x="100" y="16" width="40" height="40" rx="3" fill="currentColor" opacity=".14" />
      <path d="M120 16v40M100 36h40" {...S} strokeWidth="2" opacity=".25" />
      <rect x="16" y="46" width="6" height="42" rx="2" fill="currentColor" opacity=".7" />
      <rect x="20" y="72" width="84" height="12" rx="2" fill="currentColor" opacity=".85" />
      <rect x="20" y="60" width="84" height="14" rx="3" fill="currentColor" opacity=".5" />
      <rect x="26" y="54" width="22" height="9" rx="4" fill="currentColor" opacity=".8" />
      <path d="M24 84v10M100 84v10" {...S} strokeWidth="4" opacity=".6" />
      <rect x="114" y="76" width="22" height="16" rx="2" fill="currentColor" opacity=".7" />
      <path d="M125 76v-8" {...S} strokeWidth="2.5" opacity=".7" />
      <path d="M118 68h14l-3-12h-8z" fill="currentColor" opacity=".6" />
    </>
  ),
  rumah_sewa: (
    <>
      {TANAH}
      <rect x="42" y="54" width="76" height="40" fill="currentColor" opacity=".5" />
      <rect x="100" y="26" width="8" height="18" fill="currentColor" opacity=".6" />
      <path d="M34 56 80 20l46 36z" fill="currentColor" opacity=".9" />
      <rect x="72" y="70" width="16" height="24" rx="2" fill="var(--aksen-surface)" />
      <rect x="50" y="64" width="14" height="14" rx="1.5" fill="var(--aksen-surface)" />
      <rect x="96" y="64" width="14" height="14" rx="1.5" fill="var(--aksen-surface)" />
    </>
  ),
  villa: (
    <>
      {TANAH}
      <path d="M0 94 44 40l30 38 22-24 64 40z" fill="currentColor" opacity=".18" />
      <path d="M50 96 80 36l30 60z" fill="currentColor" opacity=".9" />
      <path d="M74 96V80a6 6 0 0 1 12 0v16z" fill="var(--aksen-surface)" />
      <path d="M80 50l8 16H72z" fill="var(--aksen-surface)" />
      <path d="M128 62l-11 26h22z" fill="currentColor" opacity=".55" />
      <rect x="126" y="88" width="4" height="8" fill="currentColor" opacity=".55" />
    </>
  ),
  guesthouse: (
    <>
      {TANAH}
      <rect x="30" y="58" width="100" height="38" fill="currentColor" opacity=".5" />
      <path d="M22 60 80 34l58 26z" fill="currentColor" opacity=".9" />
      <path d="M72 96V82a8 8 0 0 1 16 0v14z" fill="var(--aksen-surface)" />
      <rect x="40" y="70" width="16" height="14" rx="1.5" fill="var(--aksen-surface)" />
      <rect x="104" y="70" width="16" height="14" rx="1.5" fill="var(--aksen-surface)" />
      <path d="M146 96V72" {...S} strokeWidth="3" opacity=".6" />
      <rect x="140" y="62" width="16" height="10" rx="1.5" fill="currentColor" opacity=".7" />
    </>
  ),
}

const RASIO = { '4/3': 'aspect-[4/3]', '16/9': 'aspect-video', '21/9': 'aspect-[21/9]' }

export default function FotoPlaceholder({ modul, tipe, rasio = '4/3', className = '' }) {
  return (
    <div
      className={`${kelasAksen(modul)} ${RASIO[rasio] ?? RASIO['4/3']} relative overflow-hidden rounded-[10px] ${className}`}
      style={{ background: 'var(--aksen-surface)', color: 'var(--aksen)' }}
      role="img"
      aria-label="Foto simulasi"
    >
      <div className="absolute inset-x-0 bottom-0" style={{ height: '23.3%', background: 'currentColor', opacity: 0.1 }} aria-hidden="true" />
      <svg viewBox="0 0 160 120" preserveAspectRatio={rasio === '4/3' ? 'xMidYMid slice' : 'xMidYMax meet'} className="absolute inset-0 h-full w-full" aria-hidden="true">
        {ILUSTRASI[tipe] ?? ILUSTRASI.kafe}
      </svg>
      <span className="absolute bottom-1.5 left-1.5 right-1.5 w-fit rounded-md border border-[var(--border-light)] bg-white/90 px-2 py-0.5 text-center text-[12px] font-medium leading-tight text-[var(--text-secondary)]">
        Foto simulasi
      </span>
    </div>
  )
}
