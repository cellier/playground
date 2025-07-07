'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Calendar, Users, Trophy, Heart } from 'lucide-react'

const About = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const stats = [
    { icon: Calendar, number: '5+', text: '年经验' },
    { icon: Users, number: '50+', text: '满意客户' },
    { icon: Trophy, number: '25+', text: '获奖项目' },
    { icon: Heart, number: '100+', text: '设计作品' },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
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
    <section id="about" className="py-20 px-6" ref={ref}>
      <div className="container mx-auto max-w-6xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid lg:grid-cols-2 gap-16 items-center"
        >
          {/* 左侧内容 */}
          <motion.div variants={itemVariants}>
            <motion.h2
              className="text-4xl md:text-5xl font-bold mb-6"
              variants={itemVariants}
            >
              关于 <span className="gradient-text">我</span>
            </motion.h2>

            <motion.p
              className="text-lg text-gray-300 mb-6 leading-relaxed"
              variants={itemVariants}
            >
              我是一名充满激情的 UI/UX 设计师，拥有超过 5 年的设计经验。
              我专注于创造既美观又实用的数字产品，相信好的设计能够改变人们与技术互动的方式。
            </motion.p>

            <motion.p
              className="text-lg text-gray-300 mb-8 leading-relaxed"
              variants={itemVariants}
            >
              我的设计理念是"简约而不简单"，通过深入了解用户需求和业务目标，
              创造出既符合品牌调性又提供优秀用户体验的设计解决方案。
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4"
              variants={itemVariants}
            >
              {['Figma', 'Sketch', 'Adobe Creative Suite', 'Principle', 'Framer'].map((skill, index) => (
                <motion.span
                  key={skill}
                  className="px-4 py-2 bg-gray-800 rounded-full text-sm border border-gray-700"
                  whileHover={{ scale: 1.05, borderColor: '#3b82f6' }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  {skill}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>

          {/* 右侧头像和统计 */}
          <motion.div
            variants={itemVariants}
            className="relative"
          >
            {/* 头像区域 */}
            <motion.div
              className="relative mb-12"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-80 h-80 mx-auto bg-gradient-to-br from-primary-500 to-purple-600 rounded-3xl p-1">
                <div className="w-full h-full bg-gray-800 rounded-3xl flex items-center justify-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
                    <span className="text-4xl font-bold text-white">张</span>
                  </div>
                </div>
              </div>
              
              {/* 装饰元素 */}
              <motion.div
                className="absolute -top-4 -right-4 w-8 h-8 bg-primary-500 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute -bottom-4 -left-4 w-6 h-6 bg-purple-500 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </motion.div>

            {/* 统计数据 */}
            <motion.div
              className="grid grid-cols-2 gap-6"
              variants={containerVariants}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center glass-effect rounded-2xl p-6"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <stat.icon className="w-8 h-8 text-primary-500 mx-auto mb-3" />
                  <motion.div
                    className="text-3xl font-bold text-white mb-1"
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ delay: 1 + index * 0.1, type: "spring" }}
                  >
                    {stat.number}
                  </motion.div>
                  <div className="text-gray-300 text-sm">{stat.text}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default About