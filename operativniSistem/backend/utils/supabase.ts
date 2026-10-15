import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Manjkata SUPABASE_URL in SUPABASE_PUBLISHABLE_KEY v datoteki .env.')
}

export const supabase = createClient(supabaseUrl, supabaseKey)
