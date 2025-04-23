import { createClient } from "@supabase/supabase-js";

// Define the Supabase URL and key directly
const supabaseUrl = "https://wfgiteinosyqlezrtuly.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmZ2l0ZWlub3N5cWxlenJ0dWx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0ODA4NTAsImV4cCI6MjA2MDA1Njg1MH0.Ytaihj8pfc3VaVAKwctEZV0s-1ziDhE9hABi2d5sQOI";

// Create the Supabase client
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: typeof window !== "undefined" ? localStorage : undefined,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

export default supabase;
