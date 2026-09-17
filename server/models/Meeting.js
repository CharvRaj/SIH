import mongoose from 'mongoose';

const meetingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: String, required: true },
  time: { type: String },
  platform: { type: String },
  department: { type: String },
  organizer: { type: String, default: 'Ministry Coordinator' },
  attendees: [{ type: String }],
  link: { type: String },
  status: { type: String, enum: ['Upcoming', 'Completed', 'Cancelled'], default: 'Upcoming' }
}, { timestamps: true });

export default mongoose.model('Meeting', meetingSchema);
