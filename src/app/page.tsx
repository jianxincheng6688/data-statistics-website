import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* 主要内容区域 */}
      <main className="flex-grow flex flex-col relative">
        {/* 背景图片容器 */}
        <div className="absolute inset-0">
          <Image
            src="/background-molecule.jpg"
            alt="Background"
            fill
            sizes="100vw"
            priority
            className="object-cover object-center brightness-50"
          />
        </div>

        {/* 页面内容 */}
        <div className="relative z-10 flex flex-col justify-center items-center text-white px-4 py-12 mt-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">生物力学时空图谱数据库</h1>
            <p className="text-lg mb-6">
              这是一个专门用于存储和分析生物力学时空图谱数据的数据库系统，提供全面的数据管理和分析功能。
            </p>

            <div className="mb-12">
              <Link
                href="/tables"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors inline-block text-sm"
              >
                GET DATA
              </Link>
            </div>

            {/* 统计数字 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              <div className="text-center bg-black/30 backdrop-blur-sm p-3 rounded-lg">
                <div className="text-3xl font-bold mb-1">11+</div>
                <div className="text-sm">数据表</div>
              </div>
              <div className="text-center bg-black/30 backdrop-blur-sm p-3 rounded-lg">
                <div className="text-3xl font-bold mb-1">1000+</div>
                <div className="text-sm">数据记录</div>
              </div>
              <div className="text-center bg-black/30 backdrop-blur-sm p-3 rounded-lg">
                <div className="text-3xl font-bold mb-1">10+</div>
                <div className="text-sm">数据类型</div>
              </div>
              <div className="text-center bg-black/30 backdrop-blur-sm p-3 rounded-lg">
                <div className="text-3xl font-bold mb-1">5+</div>
                <div className="text-sm">分析工具</div>
              </div>
            </div>
          </div>
        </div>

        {/* 项目特点部分 */}
        <div className="relative z-10 bg-white/95 text-black py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">项目特点</h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="text-center bg-white p-4 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold mb-2">数据管理</h3>
                <p className="text-sm text-gray-600">提供全面的数据存储和管理功能，支持多种数据类型和格式。</p>
              </div>
              <div className="text-center bg-white p-4 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold mb-2">数据分析</h3>
                <p className="text-sm text-gray-600">集成多种数据分析工具，支持数据的统计分析和可视化展示。</p>
              </div>
              <div className="text-center bg-white p-4 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold mb-2">用户友好</h3>
                <p className="text-sm text-gray-600">简洁直观的用户界面，便捷的数据检索和查询功能。</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

