/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    rules: {
        "react/no-unknown-property": ["error", { ignore: ["jsx"] }],
    },

    images: {
        unoptimized: true,
    },

    assetPrefix: "./",
}

module.exports = nextConfig
