/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  transpilePackages: ["@statify/ui"],
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};
