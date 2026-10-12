import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !key) {
  throw new Error(
    'Variabel lingkungan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY belum diisi. Lihat README.md.'
  )
}

// Hanya kunci anon/publishable (baca saja). Jangan pernah memakai service_role key.
export const supabase = createClient(url, key)
