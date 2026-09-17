import express from 'express';
import Employee from '../models/Employee.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// List all employees (HR & Admin)
router.get('/', protect, authorize('hr', 'admin'), async (req, res) => {
  try {
    const { search, cadre, division, status } = req.query;
    let query = {};
    if (cadre && cadre !== 'all') query.cadre = cadre;
    if (division && division !== 'all') query.division = division;
    if (status && status !== 'all') query.status = status;
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    const employees = await Employee.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: employees.length, data: employees });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get employee by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const employee = await Employee.findOne({
      $or: [{ _id: req.params.id }, { employeeId: req.params.id }, { user: req.params.id }]
    }).populate('user', 'name email role department');

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee cadre file not found.' });
    }
    res.json({ success: true, data: employee });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update employee
router.put('/:id', protect, authorize('hr', 'admin'), async (req, res) => {
  try {
    const updated = await Employee.findOneAndUpdate(
      { $or: [{ _id: req.params.id }, { employeeId: req.params.id }] },
      req.body,
      { new: true }
    );
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
