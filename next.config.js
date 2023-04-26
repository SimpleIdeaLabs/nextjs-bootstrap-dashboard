/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['media.licdn.com', 'picsum.photos'],
    },
    env: {
        API_URL: process.env.API_URL,
        FILE_UPLOADS_URL: process.env.FILE_UPLOADS_URL,
    },
};

module.exports = nextConfig;