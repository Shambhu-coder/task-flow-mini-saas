const { Task } = require('../models');
const { Op } = require('sequelize');

// ── Get all tasks for logged-in user ─────────────────────────
const getTasks = async (req, res) => {
  try {
    const { status, priority, search } = req.query;

    const where = { userId: req.user.id };

    if (status && status !== 'all') where.status = status;
    if (priority && priority !== 'all') where.priority = priority;
    if (search) {
      where.title = { [Op.iLike]: `%${search}%` };
    }

    const tasks = await Task.findAll({
      where,
      order: [['createdAt', 'DESC']],
    });

    return res.json({ tasks });
  } catch (err) {
    console.error('Get tasks error:', err);
    return res.status(500).json({ error: 'Failed to fetch tasks.' });
  }
};

// ── Create a task ─────────────────────────────────────────────
const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Task title is required.' });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description || null,
      priority: priority || 'medium',
      dueDate: dueDate || null,
      status: 'pending',
      userId: req.user.id,
    });

    return res.status(201).json({ message: 'Task created.', task });
  } catch (err) {
    console.error('Create task error:', err);
    return res.status(500).json({ error: 'Failed to create task.' });
  }
};

// ── Update a task ─────────────────────────────────────────────
const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found or access denied.' });
    }

    const { title, description, status, priority, dueDate } = req.body;

    await task.update({
      title: title !== undefined ? title.trim() : task.title,
      description: description !== undefined ? description : task.description,
      status: status || task.status,
      priority: priority || task.priority,
      dueDate: dueDate !== undefined ? dueDate : task.dueDate,
    });

    return res.json({ message: 'Task updated.', task });
  } catch (err) {
    console.error('Update task error:', err);
    return res.status(500).json({ error: 'Failed to update task.' });
  }
};

// ── Delete a task ─────────────────────────────────────────────
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found or access denied.' });
    }

    await task.destroy();
    return res.json({ message: 'Task deleted.' });
  } catch (err) {
    console.error('Delete task error:', err);
    return res.status(500).json({ error: 'Failed to delete task.' });
  }
};

// ── Toggle task status ─────────────────────────────────────────
const toggleTaskStatus = async (req, res) => {
  try {
    const task = await Task.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    const nextStatus = task.status === 'completed' ? 'pending' : 'completed';
    await task.update({ status: nextStatus });

    return res.json({ message: 'Status toggled.', task });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to toggle status.' });
  }
};

// ── Get task stats ─────────────────────────────────────────────
const getStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const [total, pending, inProgress, completed] = await Promise.all([
      Task.count({ where: { userId } }),
      Task.count({ where: { userId, status: 'pending' } }),
      Task.count({ where: { userId, status: 'in_progress' } }),
      Task.count({ where: { userId, status: 'completed' } }),
    ]);
    return res.json({ stats: { total, pending, inProgress, completed } });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch stats.' });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask, toggleTaskStatus, getStats };
