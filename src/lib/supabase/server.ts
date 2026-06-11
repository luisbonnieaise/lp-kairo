// Cliente Supabase do SERVER (@supabase/ssr) — lê a sessão dos cookies
// escritos pelo cliente browser. Usado pela rota /api/checkout para obter o
// user.id que ancora a assinatura Stripe (customer.metadata.supabase_user_id).
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createSupabaseServerClient() {
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
          // Em Route Handlers o set funciona (refresh de token persiste);
          // em Server Components o Next proíbe escrita — ignorar é seguro,
          // o browser client refaz o refresh no próximo request.
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            /* chamada fora de Route Handler/Server Action */
          }
        },
      },
    },
  );
}
