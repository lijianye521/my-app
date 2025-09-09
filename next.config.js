/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    'antd',
    '@ant-design/nextjs-registry',
    '@ant-design/cssinjs',
    '@ant-design/icons'
  ],
  experimental: {
    // Next.js 15不再需要appDir选项
  },
  compiler: {
    // 移除生产环境中的console.log
    removeConsole: process.env.NODE_ENV === 'production',
  }
};

module.exports = nextConfig;