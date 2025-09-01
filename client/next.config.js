/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  devIndicators: {
    buildActivity: false,
  },
  images: {
    domains: ['localhost'], // Allow images to be loaded from localhost (or specify other domains if needed)
  },
}

module.exports = nextConfig;
