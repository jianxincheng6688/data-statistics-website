/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 如果您的项目中使用了图像优化，可以添加以下配置
  images: {
    domains: ["your-image-domain.com"],
  },
  // 添加一些调试信息
  onDemandEntries: {
    // 页面保持在内存中的时间（以毫秒为单位）
    maxInactiveAge: 25 * 1000,
    // 同时保持在内存中的页面数
    pagesBufferLength: 2,
  },
}

module.exports = nextConfig

