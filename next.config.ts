/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        //port: '8080',
        pathname: '/storage/**',
      },
    ],
    unoptimized: true, // désactive l'optimisation d'images en dev — évite ce blocage IP privée
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  },
};
export default nextConfig;