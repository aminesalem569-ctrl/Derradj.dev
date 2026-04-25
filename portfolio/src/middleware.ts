import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';

const intlMiddleware = createMiddleware({
  locales: ['en', 'ar'],
  defaultLocale: 'ar',
  localePrefix: 'always'
});

export default function middleware(request: NextRequest) {
  // Handle i18n routing
  const response = intlMiddleware(request);

  // Relaxed CSP for production stability
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https:;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https:;
    font-src 'self' data: https://fonts.gstatic.com;
    media-src 'self' https: blob:;
    connect-src 'self' https: wss:;
    worker-src blob:;
    frame-src https:;
    object-src 'none';
  `.replace(/\s{2,}/g, ' ').trim();

  response.headers.set('Content-Security-Policy', cspHeader);
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  return response;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
