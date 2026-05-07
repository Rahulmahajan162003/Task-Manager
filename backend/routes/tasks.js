const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// Get all tasks (Admin sees all, Member sees assigned)
router.get('/', verifyToken, async (req, res) => {
  try {
    let tasks;
    if (req.user.role === 'Admin') {
      tasks = await Task.find().populate('project assignedTo createdBy');
    } else {
      tasks = await Task.find({ assignedTo: req.user._id }).populate('project assignedTo createdBy');
    }
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create task (Admin only)
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { title, description, dueDate, project, assignedTo } = req.body;
    const task = new Task({
      title,
      description,
      dueDate,
      project,
      assignedTo,
      createdBy: req.user._id
    });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update task status (Admin or assigned Member)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    // Check permissions
    if (req.user.role !== 'Admin' && task.assignedTo.toString() !== req.user._id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { status } = req.body;
    if (status) {
      task.status = status;
    }

    // Admin can update other fields too
    if (req.user.role === 'Admin') {
      const { title, description, dueDate, assignedTo } = req.body;
      if (title) task.title = title;
      if (description) task.description = description;
      if (dueDate) task.dueDate = dueDate;
      if (assignedTo) task.assignedTo = assignedTo;
    }

    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a task (Admin only)
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
