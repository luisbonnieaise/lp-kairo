import { createBrowserClient } from "@supabase/ssr";

// Cliente Supabase para o browser (componentes client). Usa APENAS chaves
// públicas (URL + anon key) — a service role NUNCA entra na LP. Toda escrita
// de billing é feita pelos webhooks no Supabase, não daqui.
export function criarSupabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
