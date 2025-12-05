// src/lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

// 👇 pegá acá el Project URL tal cual lo copia Supabase
const supabaseUrl = "https://qjeleezjbecjpoirrhqe.supabase.co";

// 👇 y acá la ANON / public key
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqZWxlZXpqYmVjanBvaXJyaHFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1NTc3MTIsImV4cCI6MjA4MDEzMzcxMn0.TVacOzkfM07cev8GzRmgxVI6N0EsX20Qer_6_Ctiu9s";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
