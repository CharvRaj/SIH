import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // null if broadcast
  type: { type: String, enum: ['circular', 'assessment', 'meeting', 'system'], default: 'circular' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Notification', notificationSchema);
