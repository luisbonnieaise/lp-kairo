import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // /api fica FORA do middleware de i18n: sem a exclusão, /api/checkout era
  // reescrito para /<locale>/api/checkout (rota inexistente) e respondia 404.
  matcher: ["/", "/(pt|en|es|de)/:path*", "/((?!api|_next|_vercel|.*\\..*).*)"],
};
