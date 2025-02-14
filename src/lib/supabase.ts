
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pawspots.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhd3Nwb3RzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk4NjQ0MTcsImV4cCI6MjAyNTQ0MDQxN30.YOUR_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
