import { NextResponse } from "next/server";
import { criarSupabaseServer } from "@/lib/supabase/server";

// Callback do login Supabase (magic link / OAuth). Troca o `code` PKCE por uma
// sessão (gravada em cookie) e volta para a origem (`next`), tipicamente a
// seção de preços para retomar o checkout.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await criarSupabaseServer();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL(next, url.origin));
    }
    console.error("auth/callback exchange falhou:", error.message);
  }

  return NextResponse.redirect(new URL("/?auth_erro=1", url.origin));
}
