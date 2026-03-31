/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true, // Prototype safety
  },
  typescript: {
    ignoreBuildErrors: true, // Bypass strict typing conflicts if any in models mockup
  }
}

module.exports = nextConfig
post_install = true
