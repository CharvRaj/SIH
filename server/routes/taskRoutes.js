import express from 'express';
import Task from '../models/Task.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const tasks = await Task.find({
      $or: [{ assignedTo: req.user._id }, { assignedTo: null }]
    }).sort({ dueDate: 1 });
    res.json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const task = await Task.create({
      ...req.body,
      assignedTo: req.user._id,
      assignedBy: req.user.name
    });
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.patch('/:id/status', protect, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
