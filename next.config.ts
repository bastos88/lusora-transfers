import type { NextConfig } from 'next';
const backend = process.env.BACKEND_URL ?? 'http://127.0.0.1:8000';
const config: NextConfig = {
  async rewrites() { return [
    { source: '/api/:path*', destination: `${backend}/api/:path*` },
    { source: '/sanctum/:path*', destination: `${backend}/sanctum/:path*` },
    { source: '/storage/:path*', destination: `${backend}/storage/:path*` },
  ]; },
  async redirects() { return [
    { source:'/conta',destination:'/login',permanent:true },
    { source:'/minha-reserva',destination:'/customer/bookings',permanent:true },
    { source:'/informacoes-pessoais',destination:'/customer/profile',permanent:true },
    { source:'/confirmacao',destination:'/confirmation',permanent:true },
  ]; },
};
export default config;
