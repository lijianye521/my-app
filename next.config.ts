/** @type {import('next').NextConfig} */
const nextConfig = {
  // 移除output: 'export'配置，允许动态API路由
  
  // 忽略TypeScript错误
  typescript: {
    // !! 警告：在生产环境中不建议这样做
    // 这会导致类型错误被忽略，而不是修复它们
    ignoreBuildErrors: true,
  },
  
  // 忽略ESLint错误
  eslint: {
    // !! 警告：在生产环境中不建议这样做
    // 这会导致代码质量问题被忽略，而不是修复它们
    ignoreDuringBuilds: true,
  },
  
  experimental: {
    allowedDevOrigins: ['10.100.244.58', '10.106.19.29'],
  },
  poweredByHeader: false,
  swcMinify: true,

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization' },
        ],
      },
    ];
  },

  webpack: (config: any, { isServer }: { isServer: boolean }) => {
    if (isServer) {
      config.externals = [...config.externals, 'mysql2'];
    }
    return config;
  },
}

export default nextConfig