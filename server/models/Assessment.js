import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctOptionIndex: { type: Number, required: true },
  explanation: { type: String },
  category: { type: String, default: 'General' },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' }
});

const assessmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['initial', 'weekly', 'domain', 'final'], default: 'domain' },
  description: { type: String },
  durationMinutes: { type: Number, default: 30 },
  passingScore: { type: Number, default: 60 },
  questions: [questionSchema],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Assessment', assessmentSchema);
