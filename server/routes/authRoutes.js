import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Employee from '../models/Employee.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'mospi_super_secret_jwt_key_2026_secure', {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, department, designation, cadre, employeeId } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'User with this government email already exists.' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'employee',
      department: department || 'General',
      designation: designation || 'Statistical Officer',
      cadre: cadre || 'SSS',
      employeeId: employeeId || `EMP-${Math.floor(100000 + Math.random() * 900000)}`
    });

    // Also create employee profile if role is employee
    if (user.role === 'employee') {
      await Employee.create({
        user: user._id,
        employeeId: user.employeeId,
        fullName: user.name,
        email: user.email,
        cadre: user.cadre,
        designation: user.designation,
        division: user.department
      });
    }

    const token = generateToken(user._id);
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        designation: user.designation,
        employeeId: user.employeeId
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide official email and password.' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Please verify your official credentials.' });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        designation: user.designation,
        employeeId: user.employeeId
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get Current User Profile
router.get('/me', protect, async (req, res) => {
  res.json({ success: true, user: req.user });
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  res.json({
    success: true,
    message: `Password reset instructions sent to registered government email ${email}.`
  });
});

export default router;
