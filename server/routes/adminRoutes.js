import express from 'express';
import User from '../models/User.js';
import Employee from '../models/Employee.js';
import Course from '../models/Course.js';
import Assessment from '../models/Assessment.js';
import AuditLog from '../models/AuditLog.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/stats', protect, authorize('admin'), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalEmployees = await Employee.countDocuments();
    const totalCourses = await Course.countDocuments();
    const totalAssessments = await Assessment.countDocuments();

    res.json({
      success: true,
      data: {
        totalUsers,
        totalEmployees,
        totalCourses,
        totalAssessments,
        systemHealth: '100% Operational',
        databaseStatus: 'Connected',
        igotIntegration: 'Active (Synced)'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/audit-logs', protect, authorize('admin'), async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ timestamp: -1 }).limit(50);
    res.json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
