import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://YOUR_SUPABASE_URL.supabase.co';
const supabaseKey = 'YOUR_ANON_PUBLIC_KEY';

export const supabase = createClient(supabaseUrl, supabaseKey);
