import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  // Never expose env-var names or internal config to the browser console.
  // This block only fires if the build was misconfigured.
  document.body.innerHTML =
    '<div style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;color:#888">' +
    '<p>We\'re experiencing a temporary issue. Please try again later.</p></div>';
  throw new Error('Application configuration error.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
