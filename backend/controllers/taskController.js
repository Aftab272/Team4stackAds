const supabase = require('../database/supabase')

const getTasks = async (req, res) => {
  try {
    const userId = req.user.userId

    // Get all active tasks
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (tasksError) {
      return res.status(500).json({ message: 'Error fetching tasks', error: tasksError.message })
    }

    // Check which tasks user has completed
    const { data: userTasks } = await supabase
      .from('user_tasks')
      .select('task_id')
      .eq('user_id', userId)

    const completedTaskIds = new Set((userTasks || []).map(ut => ut.task_id))

    // Mark tasks as completed if user has done them
    const tasksWithStatus = (tasks || []).map(task => ({
      ...task,
      status: completedTaskIds.has(task.id) ? 'completed' : 'active',
    }))

    res.json({ tasks: tasksWithStatus })
  } catch (error) {
    console.error('Get tasks error:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

const completeTask = async (req, res) => {
  try {
    const userId = req.user.userId
    const taskId = req.params.taskId

    // Check if task exists and is active
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .eq('status', 'active')
      .single()

    if (taskError || !task) {
      return res.status(404).json({ message: 'Task not found or not available' })
    }

    // Check if user already completed this task
    const { data: existingCompletion } = await supabase
      .from('user_tasks')
      .select('id')
      .eq('user_id', userId)
      .eq('task_id', taskId)
      .single()

    if (existingCompletion) {
      return res.status(400).json({ message: 'Task already completed' })
    }

    // Record task completion
    await supabase.from('user_tasks').insert({
      user_id: userId,
      task_id: taskId,
      status: 'completed',
    })

    // Add reward to wallet
    const { data: wallet } = await supabase
      .from('wallet')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (wallet) {
      const newBalance = parseFloat(wallet.balance) + parseFloat(task.reward)
      const newTotalEarned = parseFloat(wallet.total_earned) + parseFloat(task.reward)

      await supabase
        .from('wallet')
        .update({
          balance: newBalance,
          total_earned: newTotalEarned,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)

      // Record transaction
      await supabase.from('wallet_transactions').insert({
        wallet_id: wallet.id,
        type: 'credit',
        amount: task.reward,
        description: `Task completion: ${task.title}`,
        balance_after: newBalance,
      })

      // Record earnings
      await supabase.from('earnings').insert({
        user_id: userId,
        type: 'task',
        amount: task.reward,
        description: `Completed task: ${task.title}`,
      })
    }

    res.json({ message: 'Task completed successfully! Reward added to your wallet.' })
  } catch (error) {
    console.error('Complete task error:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

// Admin: Get all tasks
const getAllTasks = async (req, res) => {
  try {
    const { status = 'all', page = 1, limit = 20 } = req.query
    const offset = (page - 1) * limit

    let query = supabase
      .from('tasks')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + parseInt(limit) - 1)

    if (status !== 'all') {
      query = query.eq('status', status)
    }

    const { data: tasks, error, count } = await query

    if (error) {
      return res.status(500).json({ message: 'Error fetching tasks', error: error.message })
    }

    res.json({
      tasks: tasks || [],
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit)),
      },
    })
  } catch (error) {
    console.error('Get all tasks error:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

// Admin: Create new task
const createTask = async (req, res) => {
  try {
    const { title, description, reward, deadline } = req.body
    const adminId = req.user.userId

    if (!title || !reward) {
      return res.status(400).json({ message: 'Title and reward are required' })
    }

    const { data: task, error } = await supabase
      .from('tasks')
      .insert({
        title,
        description,
        reward: parseFloat(reward),
        deadline: deadline || null,
        status: 'active',
      })
      .select()
      .single()

    if (error) {
      return res.status(500).json({ message: 'Error creating task', error: error.message })
    }

    // Log admin activity
    const { logAdminActivity } = require('./adminController')
    await logAdminActivity(adminId, 'CREATE_TASK', 'tasks', task.id, { title, reward })

    res.status(201).json({ message: 'Task created successfully', task })
  } catch (error) {
    console.error('Create task error:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

// Admin: Update task
const updateTask = async (req, res) => {
  try {
    const { id } = req.params
    const { title, description, reward, deadline, status } = req.body
    const adminId = req.user.userId

    const updateData = {}
    if (title) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (reward) updateData.reward = parseFloat(reward)
    if (deadline) updateData.deadline = deadline
    if (status) updateData.status = status

    const { data: task, error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return res.status(500).json({ message: 'Error updating task', error: error.message })
    }

    // Log admin activity
    const { logAdminActivity } = require('./adminController')
    await logAdminActivity(adminId, 'UPDATE_TASK', 'tasks', id, updateData)

    res.json({ message: 'Task updated successfully', task })
  } catch (error) {
    console.error('Update task error:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

// Admin: Delete task
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params
    const adminId = req.user.userId

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)

    if (error) {
      return res.status(500).json({ message: 'Error deleting task', error: error.message })
    }

    // Log admin activity
    const { logAdminActivity } = require('./adminController')
    await logAdminActivity(adminId, 'DELETE_TASK', 'tasks', id, {})

    res.json({ message: 'Task deleted successfully' })
  } catch (error) {
    console.error('Delete task error:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

module.exports = { getTasks, completeTask, getAllTasks, createTask, updateTask, deleteTask }
