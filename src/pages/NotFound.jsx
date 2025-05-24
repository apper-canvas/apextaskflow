import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface-50 via-white to-primary-50 dark:from-surface-900 dark:via-surface-800 dark:to-surface-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl mx-auto"
        >
          {/* 404 Animation */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8 md:mb-12"
          >
            <div className="relative inline-block">
              <div className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                404
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-accent to-orange-500 rounded-full flex items-center justify-center"
              >
                <ApperIcon name="Search" className="w-8 h-8 text-white" />
              </motion.div>
            </div>
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8 md:mb-12"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-surface-900 dark:text-white mb-4 md:mb-6">
              Oops! Task Not Found
            </h1>
            <p className="text-lg md:text-xl text-surface-600 dark:text-surface-300 mb-6 leading-relaxed">
              Looks like this page wandered off your task list. 
              Let's get you back to organizing your workflow!
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6"
          >
            <Link
              to="/"
              className="group flex items-center space-x-3 px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-soft hover:shadow-card transform hover:-translate-y-1 w-full sm:w-auto justify-center focus-ring"
            >
              <ApperIcon name="Home" className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Back to TaskFlow</span>
            </Link>

            <button
              onClick={() => window.history.back()}
              className="group flex items-center space-x-3 px-6 md:px-8 py-3 md:py-4 bg-surface-100 hover:bg-surface-200 dark:bg-surface-700 dark:hover:bg-surface-600 text-surface-700 dark:text-surface-200 rounded-xl font-semibold transition-all duration-200 shadow-soft hover:shadow-card transform hover:-translate-y-1 w-full sm:w-auto justify-center focus-ring"
            >
              <ApperIcon name="ArrowLeft" className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Go Back</span>
            </button>
          </motion.div>

          {/* Helpful Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 md:mt-16 p-6 md:p-8 rounded-2xl bg-white/50 dark:bg-surface-800/50 backdrop-blur-sm border border-surface-200/50 dark:border-surface-700/50"
          >
            <h3 className="text-lg md:text-xl font-semibold text-surface-900 dark:text-white mb-4">
              While you're here, why not try:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: "Plus", text: "Create a new task", color: "from-primary-500 to-primary-600" },
                { icon: "Filter", text: "Filter your tasks", color: "from-secondary-500 to-secondary-600" },
                { icon: "BarChart3", text: "Check your progress", color: "from-accent to-orange-500" }
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center p-4 rounded-xl bg-surface-50 dark:bg-surface-700/50 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors duration-200"
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mb-3`}>
                    <ApperIcon name={item.icon} className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-surface-700 dark:text-surface-300 text-center">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default NotFound