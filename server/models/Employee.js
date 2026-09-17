import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  employeeId: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  cadre: { type: String, enum: ['ISS', 'SSS', 'General', 'Contractual'], default: 'SSS' },
  batch: { type: String, default: '2020' },
  designation: { type: String, default: 'Statistical Officer' },
  division: { type: String, default: 'Field Operations Division (FOD)' },
  subOffice: { type: String, default: 'New Delhi HQ' },
  joiningDate: { type: Date, default: Date.now },
  reportingOfficer: { type: String, default: 'Director General' },
  status: { type: String, enum: ['active', 'probation', 'transferred', 'inactive'], default: 'active' },
  skills: [{
    name: { type: String },
    currentScore: { type: Number, default: 0 },
    targetScore: { type: Number, default: 85 }
  }],
  progress: {
    overallPercentage: { type: Number, default: 0 },
    coursesCompleted: { type: Number, default: 0 },
    assessmentsPassed: { type: Number, default: 0 },
    weeklyReportsSubmitted: { type: Number, default: 0 }
  },
  onboardingCompleted: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Employee', employeeSchema);
