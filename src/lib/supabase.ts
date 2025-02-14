
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jtgnphsmgnkkukcfpecq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0Z25waHNtZ25ra3VrY2ZwZWNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkzNTgxODAsImV4cCI6MjA1NDkzNDE4MH0.4ZgT0CTu8UFwjVAIV6L-GTtQfVoqfxPHPqItvfsWymI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
