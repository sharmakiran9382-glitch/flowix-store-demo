import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ucpuqlmufskvzojiblao.supabase.co';
const supabaseAnonKey = 'sb_publishable_QPHqy4Dk20wNG1JcjScxMA_wrgyHgeL';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
