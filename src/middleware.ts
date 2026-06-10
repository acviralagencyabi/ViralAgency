import { defineMiddleware } from 'astro:middleware';

// Canonicalizzazione host: l'apex (viralagency.it) deve sempre rispondere
// con un 301 verso www. Copre solo le route SSR (home, policy, sitemap,
// robots): le pagine prerenderizzate sono servite come asset statici prima
// del worker, quindi serve comunque la Redirect Rule nel dashboard Cloudflare.
export const onRequest = defineMiddleware((context, next) => {
  const url = new URL(context.request.url);
  if (url.hostname === 'viralagency.it') {
    url.hostname = 'www.viralagency.it';
    return context.redirect(url.toString(), 301);
  }
  return next();
});
