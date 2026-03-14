import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tzarkdousvjnqdudpxwh.supabase.co';
const supabaseAnonKey = 'sb_publishable_nZpA8CmEmQPpD8WGbAT7mg_xxlviGd2';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
