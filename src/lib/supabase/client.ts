// Cliente Supabase do BROWSER (@supabase/ssr) — usado só no gate de login
// pré-checkout. A sessão fica em cookies, legíveis pelo server em
// src/lib/supabase/server.ts (mesma identidade auth.users do app Flutter).
// Aqui só entra a anon key (pública); service role NUNCA entra na LP.
import { createBrowserClient } from "@supabase/ssr";

export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
