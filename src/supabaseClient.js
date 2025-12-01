import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "TU_URL_DE_SUPABASE";
const supabaseKey = "TU_PUBLIC_KEY";

export const supabase = createClient(supabaseUrl, supabaseKey);
