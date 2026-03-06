/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            { protocol: 'http', hostname: 'localhost', port: '3001', pathname: '/uploads/**' },
            { protocol: 'http', hostname: '3.7.122.146', port: '3001', pathname: '/uploads/**' },
            { protocol: 'https', hostname: '**' },
        ],
    },
    async rewrites() {
        return [
            { source: '/backend-api/:path*', destination: 'http://3.7.122.146:3001/api/:path*' },
            { source: '/backend-uploads/:path*', destination: 'http://3.7.122.146:3001/uploads/:path*' },
        ];
    },
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
        NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
    },
};

module.exports = nextConfig;
