/** @type {import('next').NextConfig} */
const isWindows = process.platform === 'win32'
const backendApiBase =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.BACKEND_API_URL ||
  'http://127.0.0.1:8000/api/v1'

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // IMPORTANT: Keep `distDir` inside the project. Next executes server bundles
  // from `<distDir>/server/...`; if `distDir` is outside `frontend/`, Node's
  // module resolution won't find `frontend/node_modules` (e.g. `react/jsx-runtime`).
  distDir: process.env.NEXT_DIST_DIR || '.next',
  // For Docker builds (Linux). On Windows local builds, standalone may attempt
  // symlinks into the output tree and fail without elevated permissions.
  output: isWindows ? undefined : 'standalone',

  // API proxy to backend - only specific backend routes, NOT NextAuth
  async rewrites() {
    return [
      // Backend routes - explicitly list what goes to backend API base URL
      // NextAuth routes (/api/auth/*) automatically stay on frontend (port 3000)
      {
        source: '/api/v1/:path*',
        destination: `${backendApiBase}/:path*`,
      },
    ]
  },

  // CORS configuration
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ]
  },
}

module.exports = nextConfig
