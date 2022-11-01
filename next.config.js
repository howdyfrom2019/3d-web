/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  exportTailingSplash: true,
  assetPrefix: process.env.NODE_ENV === "production" ? "https://howdyfrom2019.github.io/3d-web" : ""
}

module.exports = nextConfig
