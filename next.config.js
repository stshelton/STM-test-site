/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    rules: {
        "react/no-unknown-property": ["error", { ignore: ["jsx"] }],
    },
    experimental: {
        images: {
            unoptimized: true,
        },
    },
}

module.exports = nextConfig
