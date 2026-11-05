/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'media.api-sports.io' },
      { protocol: 'https', hostname: 'crests.football-data.org' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/key_sitemap',
        destination: '/key_sitemap.xml',
      },
      {
        source: '/key-sitemap.xml',
        destination: '/key_sitemap.xml',
      },
      {
        source: '/key-sitemap',
        destination: '/key_sitemap.xml',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/logo.svg',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
