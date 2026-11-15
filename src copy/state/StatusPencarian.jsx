// Status pencarian tiap tab (pilihan dan posisi gulir). Disimpan di sessionStorage:
// bertahan saat pindah tab dan saat kembali dari detail, hilang saat peramban ditutup (N07).
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { STATUS_AWAL } from '../lib/pencarian.js'

const KUNCI = 'dss.statusPencarian.v1'
const KUNCI_GULIR = 'dss.gulir.v1'

const awal = () => ({ tab: 'CW', tabs: { CW: STATUS_AWAL(), LS: STATUS_AWAL() } })

function muat() {
  try {
    const o = JSON.parse(sessionStorage.getItem(KUNCI))
    if (o?.tabs?.CW && o?.tabs?.LS && (o.tab === 'CW' || o.tab === 'LS')) {
      return { tab: o.tab, tabs: { CW: { ...STATUS_AWAL(), ...o.tabs.CW }, LS: { ...STATUS_AWAL(), ...o.tabs.LS } } }
    }
  } catch { /* abaikan */ }
  return awal()
}

export function ambilGulir(tab) {
  try { return Number(JSON.parse(sessionStorage.getItem(KUNCI_GULIR))?.[tab]) || 0 } catch { return 0 }
}
export function simpanGulir(tab, y) {
  try {
    const o = JSON.parse(sessionStorage.getItem(KUNCI_GULIR)) ?? {}
    sessionStorage.setItem(KUNCI_GULIR, JSON.stringify({ ...o, [tab]: Math.round(y) }))
  } catch { /* abaikan */ }
}

const Konteks = createContext(null)
export const useStatus = () => useContext(Konteks)

export function StatusProvider({ children }) {
  const [state, setState] = useState(muat)

  useEffect(() => {
    try { sessionStorage.setItem(KUNCI, JSON.stringify(state)) } catch { /* abaikan */ }
  }, [state])

  const setTab = useCallback((tab) => {
    simpanGulir(state.tab, window.scrollY)
    setState((s) => ({ ...s, tab }))
  }, [state.tab])
  const ubah = useCallback((modul, patch) => {
    setState((s) => ({ ...s, tabs: { ...s.tabs, [modul]: { ...s.tabs[modul], ...patch } } }))
  }, [])
  // Atur ulang hanya tab yang diminta; tab lain tidak disentuh.
  const reset = useCallback((modul) => {
    simpanGulir(modul, 0)
    setState((s) => ({ ...s, tabs: { ...s.tabs, [modul]: STATUS_AWAL() } }))
  }, [])

  const nilai = useMemo(() => ({ tab: state.tab, tabs: state.tabs, setTab, ubah, reset }), [state, setTab, ubah, reset])
  return <Konteks.Provider value={nilai}>{children}</Konteks.Provider>
}
