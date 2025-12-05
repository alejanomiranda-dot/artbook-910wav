// src/lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

// 👇 OJO: acá va la *Project URL* de Supabase, NO la URL del dashboard.
// En la pantalla de API Keys dice "Project URL". Es algo tipo:
// https://qjeleezzb...supabase.co
const supabaseUrl = "https://qjeleezjbecjpoirrhqe/supabase.co";

// 👇 Y acá va la ANON / public key (la que dice "anon public")
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqZWxlZXpqYmVjanBvaXJyaHFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1NTc3MTIsImV4cCI6MjA4MDEzMzcxMn0.TVacOzkfM07cev8GzRmgxVI6N0EsX20Qer_6_Ctiu9s";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
