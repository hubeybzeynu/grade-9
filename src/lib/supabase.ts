import { createClient } from '@supabase/supabase-js';

// Primary DB (Students, Report Cards)
export const supabase = createClient(
  'https://jqvpvahfhzothpqltbgm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxdnB2YWhmaHpvdGhwcWx0YmdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNjUxMTYsImV4cCI6MjA4OTk0MTExNn0.Y2pLkWfuaWoggUIzV4YRs3bTEzkDcYaemWyjUvKdVk4'
);

// External DB (Mid & Final Results)
export const externalSupabase = createClient(
  'https://vcmyxcfdecpmcfpkdony.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjbXl4Y2ZkZWNwbWNmcGtkb255Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNjk1NDgsImV4cCI6MjA4OTk0NTU0OH0.n7oK07eaQl9RpFbKqCUMVODnyxzUFrjdN1yJsM6yQLE'
);
