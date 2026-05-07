const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// Get all projects
router.get('/', verifyToken, async (req, res) => {
  try {
    const projects = await Project.find().populate('createdBy', 'name email');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a project (Admin only)
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { title, description } = req.body;
    const project = new Project({
      title,
      description,
      createdBy: req.user._id
    });
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a project (Admin only)
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    
    // Also delete associated tasks
    const Task = require('../models/Task');
    await Task.deleteMany({ project: req.params.id });

    res.json({ message: 'Project and associated tasks deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
