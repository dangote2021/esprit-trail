/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.utmbmontblanc.com" },
      { protocol: "https", hostname: "dgalywyr863hv.cloudfront.net" },
    ],
  },
};

module.exports = nextConfig;
