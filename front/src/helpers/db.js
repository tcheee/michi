import { createClient } from '@supabase/supabase-js';
import env from 'react-dotenv';

const supabaseUrl = env.DB_URL;
const supabaseAnonKey = env.DB_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
