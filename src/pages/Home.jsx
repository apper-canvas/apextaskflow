import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import { useContext } from 'react'
import { AuthContext } from '../App'
import { clearUser } from '../store/userSlice'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'

function Home() {
  const dispatch = useDispatch()
  const { logout } = useContext(AuthContext)
  const { user } = useSelector((state) => state.user)
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-40 glass-effect dark:bg-surface-800/80 dark:border-surface-700/50"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-soft">
                  <ApperIcon name="CheckSquare" className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
                  TaskFlow
                </h1>
                <p className="text-xs text-surface-500 dark:text-surface-400 hidden sm:block">
                  Organize Your Life
                </p>
              </div>
            </motion.div>

            <div className="flex items-center space-x-2 md:space-x-4">
              <div className="hidden lg:flex items-center space-x-3 px-3 py-2 rounded-xl bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-surface-700 dark:to-surface-600">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {user?.firstName?.charAt(0) || user?.emailAddress?.charAt(0) || 'U'}
                  </span>
                </div>
                <span className="text-sm font-medium text-surface-700 dark:text-surface-200">
                  {user?.firstName || user?.emailAddress || 'User'}
                </span>
              </div>
              
              <button
                onClick={handleLogout}
                className="p-2 md:p-3 rounded-xl bg-surface-100 hover:bg-surface-200 dark:bg-surface-700 dark:hover:bg-surface-600 transition-all duration-200 focus-ring"
                aria-label="Logout"
              >
                <ApperIcon name="LogOut" className="w-4 h-4 md:w-5 md:h-5 text-surface-600 dark:text-surface-300" />
              </button>
              
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 md:p-3 rounded-xl bg-surface-100 hover:bg-surface-200 dark:bg-surface-700 dark:hover:bg-surface-600 transition-all duration-200 focus-ring"
                aria-label="Toggle dark mode"
              >
                <ApperIcon 
                  name={darkMode ? "Sun" : "Moon"} 
                  className="w-4 h-4 md:w-5 md:h-5 text-surface-600 dark:text-surface-300" 
                />
              </button>
              
              <div className="hidden sm:flex items-center space-x-2 px-3 py-2 rounded-xl bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-surface-700 dark:to-surface-600">
                <div className="w-2 h-2 bg-secondary-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-surface-700 dark:text-surface-200">
                  Ready to organize
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative py-8 md:py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-secondary-500/10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8 md:mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-surface-900 dark:text-white mb-4 md:mb-6">
              Master Your{" "}
              <span className="bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-500 bg-clip-text text-transparent">
                Productivity
              </span>
            </h2>
            <p className="text-lg md:text-xl text-surface-600 dark:text-surface-300 max-w-3xl mx-auto leading-relaxed">
              Transform your workflow with TaskFlow's intuitive task management system. 
              Create, organize, and complete tasks with style and efficiency.
            </p>
          </motion.div>

          {/* Feature Cards */}
          <motion.div 
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-12 md:mb-16"
          >
            {[
              {
                icon: "Plus",
                title: "Create Tasks",
                description: "Add tasks with priorities and due dates",
                gradient: "from-primary-500 to-primary-600"
              },
              {
                icon: "Filter",
                title: "Smart Filtering",
                description: "Filter by status, priority, and category",
                gradient: "from-secondary-500 to-secondary-600"
              },
              {
                icon: "BarChart3",
                title: "Track Progress",
                description: "Monitor your productivity in real-time",
                gradient: "from-accent to-orange-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group p-6 rounded-2xl bg-white/70 dark:bg-surface-800/70 backdrop-blur-sm border border-surface-200/50 dark:border-surface-700/50 shadow-soft hover:shadow-card transition-all duration-300"
              >
                <div className={`w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <ApperIcon name={feature.icon} className="w-6 h-6 md:w-7 md:h-7 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-surface-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-surface-600 dark:text-surface-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Main Feature Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="py-8 md:py-12 lg:py-16"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <MainFeature />
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-surface-900 dark:bg-surface-900 text-white py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                <ApperIcon name="CheckSquare" className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">TaskFlow</h3>
                <p className="text-surface-400 text-sm">Organize Your Life</p>
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-surface-400 mb-2">
                Built with React & Tailwind CSS
              </p>
              <div className="flex items-center justify-center md:justify-end space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-secondary-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-surface-300">
                    Ready to boost productivity
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home