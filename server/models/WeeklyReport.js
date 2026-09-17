import mongoose from 'mongoose';

const weeklyReportSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  weekNumber: { type: Number, required: true },
  year: { type: Number, default: 2026 },
  summary: { type: String, required: true },
  hoursSpent: { type: Number, default: 10 },
  modulesCompleted: [{ type: String }],
  challengesFaced: { type: String },
  supervisorFeedback: { type: String },
  status: { type: String, enum: ['submitted', 'reviewed', 'approved'], default: 'submitted' },
  score: { type: String, default: 'A' }
}, { timestamps: true });

export default mongoose.model('WeeklyReport', weeklyReportSchema);
