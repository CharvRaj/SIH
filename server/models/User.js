import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['employee', 'hr', 'admin'], default: 'employee' },
  department: { type: String, default: 'General' },
  designation: { type: String, default: 'Officer' },
  cadre: { type: String, default: 'SSS' },
  employeeId: { type: String, unique: true, sparse: true },
  avatar: { type: String, default: '' },
  phone: { type: String, default: '' },
  language: { type: String, default: 'en' },
  theme: { type: String, default: 'light' },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date, default: null }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);
