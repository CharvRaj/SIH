import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedBy: { type: String, default: 'Ministry Administration' },
  dueDate: { type: Date },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  status: { type: String, enum: ['pending', 'in_progress', 'completed'], default: 'pending' },
  category: { type: String, default: 'Learning' }
}, { timestamps: true });

export default mongoose.model('Task', taskSchema);
