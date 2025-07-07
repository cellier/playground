'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { ExternalLink, Github } from 'lucide-react'

const Portfolio = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [filter, setFilter] = useState('all')

  const projects = [
    {
      id: 1,
      title: '电商应用重设计',
      category: 'mobile',
      description: '为某知名电商平台设计的移动端应用界面，提升了用户购物体验和转化率。',
      image: '/api/placeholder/400/300',
      tags: ['UI/UX', 'Mobile', 'E-commerce'],
      color: 'from-blue-500 to-purple-600'
    },
    {
      id: 2,
      title: '金融科技仪表板',
      category: 'web',
      description: '为金融科技公司设计的数据可视化仪表板，让复杂数据一目了然。',
      image: '/api/placeholder/400/300',
      tags: ['Dashboard', 'Fintech', 'Data Viz'],
      color: 'from-green-500 to-blue-600'
    },
    {
      id: 3,
      title: '健康管理应用',
      category: 'mobile',
      description: '专注于用户健康管理的移动应用，简洁的界面设计提升了用户粘性。',
      image: '/api/placeholder/400/300',
      tags: ['Healthcare', 'Mobile', 'Wellness'],
      color: 'from-pink-500 to-red-600'
    },
    {
      id: 4,
      title: '企业官网重构',
      category: 'web',
      description: '为科技企业设计的响应式官网，现代化的设计语言提升了品牌形象。',
      image: '/api/placeholder/400/300',
      tags: ['Website', 'Corporate', 'Responsive'],
      color: 'from-purple-500 to-indigo-600'
    },
    {
      id: 5,
      title: '社交媒体工具',
      category: 'web',
      description: '为内容创作者设计的社交媒体管理工具，直观的界面提高了工作效率。',
      image: '/api/placeholder/400/300',
      tags: ['Social Media', 'Tools', 'Productivity'],
      color: 'from-orange-500 to-pink-600'
    },
    {
      id: 6,
      title: '教育平台界面',
      category: 'mobile',
      description: '在线教育平台的移动端设计，友好的界面让学习变得更加轻松愉快。',
      image: '/api/placeholder/400/300',
      tags: ['Education', 'Mobile', 'Learning'],
      color: 'from-teal-500 to-green-600'
    }
  ]

  const categories = [
    { id: 'all', name: '全部' },
    { id: 'web', name: '网页设计' },
    { id: 'mobile', name: '移动应用' },
  ]

  const filteredProjects = filter === 'all' ? projects : projects.filter(project => project.category === filter)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.6
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  }

  return (
    <section id="portfolio" className="py-20 px-6" ref={ref}>
      <div className="container mx-auto max-w-7xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            我的 <span className="gradient-text">作品</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            这里展示了我近期的一些设计作品，每个项目都体现了我对用户体验和视觉设计的深度思考。
          </p>
        </motion.div>

        {/* 筛选按钮 */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setFilter(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                filter === category.id
                  ? 'bg-primary-500 text-white glow-effect'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category.name}
            </motion.button>
          ))}
        </motion.div>

        {/* 项目网格 */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              className="group glass-effect rounded-2xl overflow-hidden hover:glow-effect transition-all duration-300"
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              layout
            >
              {/* 项目图片 */}
              <div className="relative h-48 overflow-hidden">
                <div className={`w-full h-full bg-gradient-to-br ${project.color} flex items-center justify-center`}>
                  <div className="text-white text-6xl font-bold opacity-20">
                    {project.id}
                  </div>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <div className="flex space-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <motion.button
                      className="p-2 bg-white bg-opacity-20 rounded-full text-white hover:bg-opacity-30"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ExternalLink size={20} />
                    </motion.button>
                    <motion.button
                      className="p-2 bg-white bg-opacity-20 rounded-full text-white hover:bg-opacity-30"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Github size={20} />
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* 项目信息 */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs bg-gray-700 text-gray-300 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* 查看更多按钮 */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <motion.button
            className="group border border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 flex items-center gap-3 mx-auto"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            查看更多作品
            <motion.div
              className="w-0 h-0.5 bg-current group-hover:w-4 transition-all duration-300"
            />
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

export default Portfolio