import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { buatRepo } from '../lib/repo.js'

const Konteks = createContext(null)
export const useData = () => useContext(Konteks)

const repo = buatRepo(supabase)

export function DataProvider({ children }) {
  const [s, setS] = useState({ status: 'memuat' })

  const muat = useCallback(async () => {
    setS({ status: 'memuat' })
    try {
      const [konfigurasi, kCW, kLS, tCW, tLS] = await Promise.all([
        repo.konfigurasi(), repo.kriteria('CW'), repo.kriteria('LS'), repo.tempatPerModul('CW'), repo.tempatPerModul('LS'),
      ])
      setS({ status: 'siap', konfigurasi, kriteria: { CW: kCW, LS: kLS }, tempat: { CW: tCW, LS: tLS } })
    } catch (e) {
      setS({ status: 'galat', pesan: e.message })
    }
  }, [])

  useEffect(() => { muat() }, [muat])

  const nilai = useMemo(() => {
    if (s.status !== 'siap') return { ...s, muat, repo }
    const semua = [...s.tempat.CW, ...s.tempat.LS]
    const peta = new Map(semua.map((t) => [t.id, t]))
    return { ...s, muat, repo, semua, tempatById: (id) => peta.get(id) ?? null }
  }, [s, muat])

  return <Konteks.Provider value={nilai}>{children}</Konteks.Provider>
}
