import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import assessmentRoutes from './routes/assessmentRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import meetingRoutes from './routes/meetingRoutes.js';
import weeklyReportRoutes from './routes/weeklyReportRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Utility Middleware
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// MongoDB Connection with graceful fallback
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/SIH';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MoSPI MongoDB database.'))
  .catch((err) => {
    console.warn('⚠️ MongoDB connection issue (proceeding with API service):', err.message);
  });

// API Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    ministry: 'Ministry of Statistics and Programme Implementation (MoSPI)',
    platform: 'MoSPI Adaptive Learning Platform',
    version: '1.0.0',
    dbStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected/mock',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/weekly-reports', weeklyReportRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

// Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 MoSPI Learning Platform API running on port ${PORT}`);
  console.log(`🌐 Health check available at http://localhost:${PORT}/api/health`);
});
