import express from 'express';
import Meeting from '../models/Meeting.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const meetings = await Meeting.find().sort({ date: 1 });
    res.json({ success: true, count: meetings.length, data: meetings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const meeting = await Meeting.create({
      ...req.body,
      organizer: req.user.name
    });
    res.status(201).json({ success: true, data: meeting });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
