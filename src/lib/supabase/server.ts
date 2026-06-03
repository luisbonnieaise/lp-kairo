import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Cliente Supabase para o servidor (route handlers / server components). Lê e
// escreve a sessão via cookies (padrão @supabase/ssr). Só chaves públicas —
// a identidade vem do JWT do usuário no cookie, nunca da service role.
export async function criarSupabaseServer() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          // Em route handlers o set funciona; em server components (render)
          // pode lançar — ignoramos pois o middleware renova a sessão.
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            /* chamada fora de contexto de resposta — seguro ignorar */
          }
        },
      },
    },
  );
}
