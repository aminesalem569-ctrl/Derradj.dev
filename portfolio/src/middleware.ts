import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';

const intlMiddleware = createMiddleware({
  locales: ['en', 'ar'],
  defaultLocale: 'en'
});

export default function middleware(request: NextRequest) {
  // Handle i18n routing
  const response = intlMiddleware(request);

  // Apply Security Headers
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline'
      https://va.vercel-scripts.com
      https://apis.google.com
      https://*.firebaseio.com
      https://upload-widget.cloudinary.com
      https://ajax.googleapis.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https:;
    font-src 'self' data: https://fonts.gstatic.com;
    media-src 'self' https: blob:;
    connect-src 'self'
      https://*.googleapis.com
      https://*.firebaseio.com
      https://*.firebaseapp.com
      https://firestore.googleapis.com
      https://identitytoolkit.googleapis.com
      https://securetoken.googleapis.com
      https://api.cloudinary.com
      https://upload.cloudinary.com
      https://res.cloudinary.com
      wss://*.firebaseio.com;
    worker-src blob:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    frame-src https://*.firebaseapp.com https://upload-widget.cloudinary.com;
  `.replace(/\s{2,}/g, ' ').trim();

  response.headers.set('Content-Security-Policy', cspHeader);
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  );

  return response;
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(ar|en)/:path*']
};
