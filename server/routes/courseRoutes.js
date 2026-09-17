import express from 'express';
import Course from '../models/Course.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const { category, cadre, level, search } = req.query;
    let query = {};
    if (category && category !== 'all') query.category = category;
    if (level && level !== 'all') query.level = level;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { courseId: { $regex: search, $options: 'i' } }
      ];
    }
    const courses = await Course.find(query);
    res.json({ success: true, count: courses.length, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/:id/enroll', protect, async (req, res) => {
  res.json({ success: true, message: 'Enrolled in iGOT Karmayogi course successfully.' });
});

export default router;
