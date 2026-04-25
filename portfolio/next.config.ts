import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
      allowedOrigins: ['localhost:3000', 'derradj-dev.vercel.app']
    }
  }
};

export default withNextIntl(nextConfig);
