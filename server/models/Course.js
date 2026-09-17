import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  courseId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  cadre: [{ type: String }],
  durationHours: { type: Number, default: 4 },
  modulesCount: { type: Number, default: 5 },
  isMandatory: { type: Boolean, default: false },
  igotUrl: { type: String, default: 'https://igotkarmayogi.gov.in' },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Intermediate' },
  enrolledCount: { type: Number, default: 0 },
  completionRate: { type: Number, default: 85 }
}, { timestamps: true });

export default mongoose.model('Course', courseSchema);
