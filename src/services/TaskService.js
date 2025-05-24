class TaskService {
  constructor() {
    const { ApperClient } = window.ApperSDK
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'task'
    
    // All fields from the task table
    this.allFields = [
      'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
      'title', 'description', 'priority', 'category', 'dueDate', 'completed', 'createdAt', 'updatedAt'
    ]
    
    // Only updateable fields for create/update operations
    this.updateableFields = [
      'Name', 'Tags', 'Owner', 'title', 'description', 'priority', 'category', 'dueDate', 'completed', 'createdAt', 'updatedAt'
    ]
  }

  async fetchTasks(userId = null, filters = {}) {
    try {
      const params = {
        fields: this.allFields,
        orderBy: [
          {
            fieldName: "dueDate",
            SortType: "ASC"
          }
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      }

      // Add user filter if userId is provided
      if (userId) {
        params.where = [
          {
            fieldName: "Owner",
            operator: "ExactMatch",
            values: [userId]
          }
        ]
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response || !response.data || response.data.length === 0) {
        return []
      }
      
      return response.data
    } catch (error) {
      console.error("Error fetching tasks:", error)
      throw new Error("Failed to fetch tasks. Please try again.")
    }
  }

  async getTaskById(taskId) {
    try {
      const params = {
        fields: this.allFields
      }

      const response = await this.apperClient.getRecordById(this.tableName, taskId, params)
      
      if (!response || !response.data) {
        return null
      }
      
      return response.data
    } catch (error) {
      console.error(`Error fetching task with ID ${taskId}:`, error)
      throw new Error("Failed to fetch task details. Please try again.")
    }
  }

  async createTask(taskData, userId) {
    try {
      // Filter only updateable fields and format data properly
      const formattedData = this.formatTaskData(taskData, userId)
      
      const params = {
        records: [formattedData]
      }

      const response = await this.apperClient.createRecord(this.tableName, params)
      
      if (response && response.success && response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error("Failed to create task:", failedRecords)
          failedRecords.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => {
                console.error(`Field: ${error.fieldLabel}, Error: ${error.message}`)
              })
            } else if (record.message) {
              console.error(`Error: ${record.message}`)
            }
          })
          throw new Error("Failed to create task. Please check your input and try again.")
        }
        
        return successfulRecords.map(result => result.data)[0]
      } else {
        console.error("Task creation failed:", response)
        throw new Error("Failed to create task. Please try again.")
      }
    } catch (error) {
      console.error("Error creating task:", error)
      throw error
    }
  }

  async updateTask(taskId, taskData, userId) {
    try {
      // Filter only updateable fields and format data properly
      const formattedData = this.formatTaskData(taskData, userId, taskId)
      
      const params = {
        records: [formattedData]
      }

      const response = await this.apperClient.updateRecord(this.tableName, params)
      
      if (response && response.success && response.results) {
        const successfulUpdates = response.results.filter(result => result.success)
        const failedUpdates = response.results.filter(result => !result.success)
        
        if (failedUpdates.length > 0) {
          console.error("Failed to update task:", failedUpdates)
          failedUpdates.forEach(record => {
            console.error(`Error: ${record.message || "Record does not exist"}`)
          })
          throw new Error("Failed to update task. Please try again.")
        }
        
        return successfulUpdates.map(result => result.data)[0]
      } else {
        console.error("Task update failed:", response)
        throw new Error("Failed to update task. Please try again.")
      }
    } catch (error) {
      console.error("Error updating task:", error)
      throw error
    }
  }

  async deleteTask(taskId) {
    try {
      const params = {
        RecordIds: [taskId]
      }

      const response = await this.apperClient.deleteRecord(this.tableName, params)
      
      if (response && response.success && response.results) {
        const successfulDeletions = response.results.filter(result => result.success)
        const failedDeletions = response.results.filter(result => !result.success)
        
        if (failedDeletions.length > 0) {
          console.error("Failed to delete task:", failedDeletions)
          failedDeletions.forEach(record => {
            console.error(`Error: ${record.message || "Record does not exist"}`)
          })
          throw new Error("Failed to delete task. Please try again.")
        }
        
        return true
      } else {
        console.error("Task deletion failed:", response)
        throw new Error("Failed to delete task. Please try again.")
      }
    } catch (error) {
      console.error("Error deleting task:", error)
      throw error
    }
  }

  formatTaskData(taskData, userId, taskId = null) {
    const currentDateTime = new Date().toISOString()
    
    const formattedData = {
      // Include ID for updates
      ...(taskId && { Id: taskId }),
      
      // Map form fields to database fields with proper formatting
      Name: taskData.title || '', // Map title to Name field
      title: taskData.title || '',
      description: taskData.description || '',
      priority: taskData.priority || 'medium',
      category: taskData.category || 'general',
      dueDate: taskData.dueDate || '', // Date format YYYY-MM-DD
      completed: Boolean(taskData.completed), // Boolean type
      Owner: userId, // Lookup field for user
      updatedAt: currentDateTime, // DateTime format
    }
    
    // Only set createdAt for new tasks
    if (!taskId) {
      formattedData.createdAt = currentDateTime
    }
    
    // Filter to include only updateable fields
    const filteredData = {}
    Object.keys(formattedData).forEach(key => {
      if (key === 'Id' || this.updateableFields.includes(key)) {
        filteredData[key] = formattedData[key]
      }
    })
    
    return filteredData
  }

  // Helper method to search tasks
  async searchTasks(searchTerm, userId = null) {
    try {
      const params = {
        fields: this.allFields,
        where: [
          {
            fieldName: "title",
            operator: "Contains",
            values: [searchTerm]
          }
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      }

      // Add user filter if userId is provided
      if (userId) {
        params.whereGroups = [
          {
            operator: "AND",
            subGroups: [
              {
                conditions: [
                  {
                    fieldName: "title",
                    operator: "Contains",
                    values: [searchTerm]
                  }
                ],
                operator: ""
              },
              {
                conditions: [
                  {
                    fieldName: "Owner",
                    operator: "ExactMatch",
                    values: [userId]
                  }
                ],
                operator: ""
              }
            ]
          }
        ]
        delete params.where
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response || !response.data || response.data.length === 0) {
        return []
      }
      
      return response.data
    } catch (error) {
      console.error("Error searching tasks:", error)
      throw new Error("Failed to search tasks. Please try again.")
    }
  }
}

export default new TaskService()