import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !key) console.error('VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY belum diisi. Lihat README.md.')

// Hanya kunci anon/publishable (baca saja). Jangan pernah memakai service_role key.
// Tidak melempar error saat di-import: DataProvider yang menampilkan pesan galat bila `supabase` bernilai null.
export const supabase = url && key ? createClient(url, key) : null