import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // /api e /og ficam FORA do middleware de i18n. Sem a exclusão de /api, o
  // /api/checkout era reescrito para /<locale>/api/checkout (404). Já o /og é
  // o card OpenGraph (route handler que recebe o locale por query ?l=); deixá-lo
  // no matcher faria o redirect "as-needed" mandar /pt/og → /og e quebrar.
  matcher: [
    "/",
    "/(pt|en|es|de)/:path*",
    "/((?!api|og|_next|_vercel|.*\\..*).*)",
  ],
};
