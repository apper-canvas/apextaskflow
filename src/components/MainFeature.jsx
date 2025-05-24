import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format, isAfter, isBefore, isToday, isPast } from 'date-fns'
import ApperIcon from './ApperIcon'

function MainFeature() {
  const [tasks, setTasks] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('dueDate')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    category: 'general'
  })
  const [editingTask, setEditingTask] = useState(null)

  const categories = [
    { id: 'general', name: 'General', color: 'bg-surface-500' },
    { id: 'work', name: 'Work', color: 'bg-primary-500' },
    { id: 'personal', name: 'Personal', color: 'bg-secondary-500' },
    { id: 'urgent', name: 'Urgent', color: 'bg-red-500' },
    { id: 'health', name: 'Health', color: 'bg-green-500' }
  ]

  const priorities = [
    { id: 'low', name: 'Low', color: 'text-green-600', bg: 'bg-green-100' },
    { id: 'medium', name: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { id: 'high', name: 'High', color: 'text-red-600', bg: 'bg-red-100' }
  ]

  // Load tasks from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem('taskflow-tasks')
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }
  }, [])

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem('taskflow-tasks', JSON.stringify(tasks))
  }, [tasks])

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      toast.error('Task title is required!')
      return
    }

    const taskData = {
      ...formData,
      id: editingTask?.id || Date.now().toString(),
      completed: editingTask?.completed || false,
      createdAt: editingTask?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    if (editingTask) {
      setTasks(tasks.map(task => task.id === editingTask.id ? taskData : task))
      toast.success('Task updated successfully!')
    } else {
      setTasks([...tasks, taskData])
      toast.success('Task created successfully!')
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      category: 'general'
    })
    setEditingTask(null)
    setShowForm(false)
  }

  const editTask = (task) => {
    setFormData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate,
      category: task.category
    })
    setEditingTask(task)
    setShowForm(true)
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id))
    toast.success('Task deleted successfully!')
  }

  const toggleComplete = (id) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const updatedTask = { ...task, completed: !task.completed }
        if (updatedTask.completed) {
          toast.success('Task completed! 🎉')
        }
        return updatedTask
      }
      return task
    }))
  }

  const getFilteredTasks = () => {
    let filtered = [...tasks]

    // Filter by status
    switch (filter) {
      case 'completed':
        filtered = filtered.filter(task => task.completed)
        break
      case 'pending':
        filtered = filtered.filter(task => !task.completed)
        break
      case 'overdue':
        filtered = filtered.filter(task => 
          !task.completed && task.dueDate && isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate))
        )
        break
      case 'today':
        filtered = filtered.filter(task => 
          task.dueDate && isToday(new Date(task.dueDate))
        )
        break
    }

    // Sort tasks
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) return 0
          if (!a.dueDate) return 1
          if (!b.dueDate) return -1
          return new Date(a.dueDate) - new Date(b.dueDate)
        case 'created':
          return new Date(b.createdAt) - new Date(a.createdAt)
        default:
          return 0
      }
    })

    return filtered
  }

  const getTaskStats = () => {
    const total = tasks.length
    const completed = tasks.filter(task => task.completed).length
    const pending = total - completed
    const overdue = tasks.filter(task => 
      !task.completed && task.dueDate && isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate))
    ).length

    return { total, completed, pending, overdue }
  }

  const filteredTasks = getFilteredTasks()
  const stats = getTaskStats()

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-8 md:mb-12"
      >
        <h2 className="text-2xl md:text-4xl font-bold text-surface-900 dark:text-white mb-4">
          Your Task Dashboard
        </h2>
        <p className="text-surface-600 dark:text-surface-300 max-w-2xl mx-auto">
          Create, organize, and track your tasks with powerful filtering and sorting options
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8"
      >
        {[
          { label: 'Total Tasks', value: stats.total, icon: 'CheckSquare', color: 'from-primary-500 to-primary-600' },
          { label: 'Completed', value: stats.completed, icon: 'CheckCircle', color: 'from-secondary-500 to-secondary-600' },
          { label: 'Pending', value: stats.pending, icon: 'Clock', color: 'from-accent to-orange-500' },
          { label: 'Overdue', value: stats.overdue, icon: 'AlertTriangle', color: 'from-red-500 to-red-600' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 + index * 0.05 }}
            className="p-4 md:p-6 rounded-2xl bg-white/70 dark:bg-surface-800/70 backdrop-blur-sm border border-surface-200/50 dark:border-surface-700/50 shadow-soft"
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                <ApperIcon name={stat.icon} className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <span className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white">
                {stat.value}
              </span>
            </div>
            <p className="text-sm md:text-base text-surface-600 dark:text-surface-300 font-medium">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Controls */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col lg:flex-row gap-4 lg:gap-6 mb-8"
      >
        {/* Add Task Button */}
        <motion.button
          onClick={() => setShowForm(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-center space-x-3 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl font-semibold shadow-soft hover:shadow-card transition-all duration-200 focus-ring"
        >
          <ApperIcon name="Plus" className="w-5 h-5" />
          <span>Add New Task</span>
        </motion.button>

        {/* Filters and Sort */}
        <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 flex-1">
          <div className="flex-1">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white dark:bg-surface-700 border border-surface-200 dark:border-surface-600 text-surface-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            >
              <option value="all">All Tasks</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="today">Due Today</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          <div className="flex-1">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white dark:bg-surface-700 border border-surface-200 dark:border-surface-600 text-surface-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            >
              <option value="dueDate">Sort by Due Date</option>
              <option value="priority">Sort by Priority</option>
              <option value="created">Sort by Created</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Task Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && resetForm()}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl bg-white dark:bg-surface-800 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-surface-900 dark:text-white">
                    {editingTask ? 'Edit Task' : 'Create New Task'}
                  </h3>
                  <button
                    onClick={resetForm}
                    className="p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                  >
                    <ApperIcon name="X" className="w-6 h-6 text-surface-500" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2">
                      Task Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 text-surface-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter task title..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 text-surface-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none"
                      placeholder="Add a description..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2">
                        Priority
                      </label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData({...formData, priority: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 text-surface-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      >
                        {priorities.map(priority => (
                          <option key={priority.id} value={priority.id}>
                            {priority.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2">
                        Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 text-surface-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      >
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2">
                        Due Date
                      </label>
                      <input
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 text-surface-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl font-semibold shadow-soft hover:shadow-card transition-all duration-200 focus-ring"
                    >
                      {editingTask ? 'Update Task' : 'Create Task'}
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex-1 px-6 py-3 bg-surface-100 hover:bg-surface-200 dark:bg-surface-700 dark:hover:bg-surface-600 text-surface-700 dark:text-surface-200 rounded-xl font-semibold transition-all duration-200 focus-ring"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tasks List */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 md:py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-surface-200 to-surface-300 dark:from-surface-700 dark:to-surface-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <ApperIcon name="CheckSquare" className="w-12 h-12 text-surface-400 dark:text-surface-500" />
            </div>
            <h3 className="text-xl md:text-2xl font-semibold text-surface-900 dark:text-white mb-2">
              No tasks found
            </h3>
            <p className="text-surface-600 dark:text-surface-300 mb-6">
              {filter === 'all' ? 'Create your first task to get started!' : 'No tasks match your current filter.'}
            </p>
            {filter === 'all' && (
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl font-semibold transition-all duration-200 focus-ring"
              >
                <ApperIcon name="Plus" className="w-5 h-5" />
                <span>Create First Task</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 md:gap-6">
            <AnimatePresence>
              {filteredTasks.map((task, index) => {
                const category = categories.find(c => c.id === task.category)
                const priority = priorities.find(p => p.id === task.priority)
                const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate)) && !task.completed
                const isDueToday = task.dueDate && isToday(new Date(task.dueDate))

                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className={`group p-4 md:p-6 rounded-2xl bg-white/70 dark:bg-surface-800/70 backdrop-blur-sm border transition-all duration-200 hover:shadow-card ${
                      task.completed 
                        ? 'border-secondary-200 dark:border-secondary-800 bg-secondary-50/30 dark:bg-secondary-900/20' 
                        : isOverdue
                        ? 'border-red-200 dark:border-red-800 bg-red-50/30 dark:bg-red-900/20'
                        : isDueToday
                        ? 'border-accent/30 dark:border-accent/50 bg-accent/5 dark:bg-accent/10'
                        : 'border-surface-200/50 dark:border-surface-700/50'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Completion Checkbox */}
                      <motion.button
                        onClick={() => toggleComplete(task.id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 mt-1 ${
                          task.completed
                            ? 'bg-secondary-500 border-secondary-500 text-white'
                            : 'border-surface-300 dark:border-surface-600 hover:border-secondary-400'
                        }`}
                      >
                        {task.completed && (
                          <ApperIcon name="Check" className="w-4 h-4" />
                        )}
                      </motion.button>

                      {/* Task Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                          <h4 className={`text-lg md:text-xl font-semibold transition-all duration-200 ${
                            task.completed 
                              ? 'text-surface-500 dark:text-surface-400 line-through' 
                              : 'text-surface-900 dark:text-white'
                          }`}>
                            {task.title}
                          </h4>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            {/* Priority Badge */}
                            <span className={`px-2 py-1 rounded-lg text-xs font-medium ${priority.bg} ${priority.color}`}>
                              {priority.name}
                            </span>

                            {/* Category Badge */}
                            <span className={`px-2 py-1 rounded-lg text-xs font-medium text-white ${category.color}`}>
                              {category.name}
                            </span>
                          </div>
                        </div>

                        {task.description && (
                          <p className={`text-sm md:text-base mb-3 transition-all duration-200 ${
                            task.completed 
                              ? 'text-surface-400 dark:text-surface-500' 
                              : 'text-surface-600 dark:text-surface-300'
                          }`}>
                            {task.description}
                          </p>
                        )}

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          {/* Due Date */}
                          {task.dueDate && (
                            <div className="flex items-center space-x-2">
                              <ApperIcon 
                                name={isOverdue ? "AlertTriangle" : isDueToday ? "Clock" : "Calendar"} 
                                className={`w-4 h-4 ${
                                  isOverdue ? 'text-red-500' : isDueToday ? 'text-accent' : 'text-surface-400'
                                }`} 
                              />
                              <span className={`text-sm font-medium ${
                                isOverdue ? 'text-red-600 dark:text-red-400' : 
                                isDueToday ? 'text-accent dark:text-accent' : 
                                'text-surface-500 dark:text-surface-400'
                              }`}>
                                {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                                {isOverdue && ' (Overdue)'}
                                {isDueToday && ' (Today)'}
                              </span>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => editTask(task)}
                              className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-500 hover:text-primary-600 transition-all duration-200 focus-ring"
                              aria-label="Edit task"
                            >
                              <ApperIcon name="Edit2" className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteTask(task.id)}
                              className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-500 hover:text-red-600 transition-all duration-200 focus-ring"
                              aria-label="Delete task"
                            >
                              <ApperIcon name="Trash2" className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default MainFeature