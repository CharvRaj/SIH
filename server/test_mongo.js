import mongoose from 'mongoose';

async function test() {
  try {
    await mongoose.connect('mongodb://localhost:27017/SIH', { serverSelectionTimeoutMS: 2500 });
    console.log('✅ MongoDB connection SUCCESSFUL');
    process.exit(0);
  } catch (err) {
    console.log('❌ MongoDB connection FAILED:', err.message);
    process.exit(1);
  }
}

test();
