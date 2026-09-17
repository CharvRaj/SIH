import express from 'express';
import WeeklyReport from '../models/WeeklyReport.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const query = req.user.role === 'employee' ? { user: req.user._id } : {};
    const reports = await WeeklyReport.find(query).populate('user', 'name email department').sort({ createdAt: -1 });
    res.json({ success: true, count: reports.length, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const report = await WeeklyReport.create({
      ...req.body,
      user: req.user._id
    });
    res.status(201).json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
