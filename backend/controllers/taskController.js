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

module.exports = { getTasks, completeTask }
