import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://supabase.com/dashboard/project/qjeleezjbecjpoirrhqe/settings/api-keys";
const supabaseKey = "sb_publishable_UrmYOoxd08ksuhSU3b-mKQ_SaPzTZCC";

export const supabase = createClient(supabaseUrl, supabaseKey);
