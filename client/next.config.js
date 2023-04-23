/** @type {import('next').NextConfig} */
const dotenv = require("dotenv");
dotenv.config({ path: "./secrets/.env.local" });

const nextConfig = {
  reactStrictMode: true,
  env: {
    WEB3_STORAGE_API_KEY: process.env.WEB3_STORAGE_API_KEY,
    CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS,
  },
};

module.exports = nextConfig;
