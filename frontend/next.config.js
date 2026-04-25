/** @type {import('next').NextConfig} */
const isWindows = process.platform === 'win32'
const backendApiBase =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.BACKEND_API_URL ||
  'http://127.0.0.1:8000/api/v1'

// 1. จัดการ API URL ให้ยืดหยุ่นและปลอดภัย
const getBackendApiBase = () => {
  const url = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_API_URL;
  
  // ถ้าอยู่ใน Production แล้วหา URL ไม่เจอ ให้แจ้งเตือนชัดเจนแทนการแอบใช้ localhost
  if (!url && process.env.NODE_ENV === 'production') {
    console.warn("⚠️ Warning: NEXT_PUBLIC_API_URL is not defined. API rewrites might fail.");
    // คืนค่าว่างหรือค่าที่คุณแก้ล่าสุดเพื่อเป็น Fallback ตัวสุดท้าย
    return 'https://culinarycrafts-production-b4c2.up.railway.app/api/v1';
  }
  
  return url || 'http://127.0.0.1:8000/api/v1';
};

const backendApiBase = getBackendApiBase();

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // โครงสร้างโฟลเดอร์สำหรับการรันบน Railway
  distDir: process.env.NEXT_DIST_DIR || '.next',
  output: isWindows ? undefined : 'standalone',

  // ส่วนการส่งต่อ Request (Proxy)
  async rewrites() {
    return [
      {
        // เมื่อ Frontend เรียก /api/v1/... ให้ส่งต่อไปที่ Backend URL
        source: '/api/v1/:path*',
        destination: `${backendApiBase}/:path*`,
      },
    ];
  },

  // การตั้งค่าความปลอดภัย (Security Headers & CORS)
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' }, // ในอนาคตควรระบุ Domain จริงเพื่อความปลอดภัย
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },
  
  // เพิ่มการตั้งค่าเพื่อรองรับรูปภาพ (ถ้ามี)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.up.railway.app',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com', // เผื่อไว้สำหรับรูปจาก Google Cloud
      },
    ],
  },
}

module.exports = nextConfig
