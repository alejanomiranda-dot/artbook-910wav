// src/lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

// 👇 OJO: acá va la *Project URL* de Supabase, NO la URL del dashboard.
// En la pantalla de API Keys dice "Project URL". Es algo tipo:
// https://qjeleezzb...supabase.co
const supabaseUrl = "https://qjeleezjbecjpoirrhqe/supabase.co";

// 👇 Y acá va la ANON / public key (la que dice "anon public")
const supabaseAnonKey = "sb_publishable_UrmYOoxd08ksuhSU3b-mKQ_SaPzTZCC";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
