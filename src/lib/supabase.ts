import { createClient } from '@supabase/supabase-js'

// Define the Supabase URL and key directly
const supabaseUrl = 'https://lgsqpwllqdcnnlnnnfrt.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxnc3Fwd2xscWRjbm5sbm5uZnJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5NzYyOTcsImV4cCI6MjA1OTU1MjI5N30.0ue23WEqZJ36An3NPqy-PP-Kbx2iHA99TDCBvZhPTg4'

// Create the Supabase client
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

export default supabase 