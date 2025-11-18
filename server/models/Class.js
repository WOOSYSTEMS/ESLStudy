const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  enrollmentCode: {
    type: String,
    unique: true,
    required: true
  },
  level: {
    type: String,
    enum: ['beginner', 'elementary', 'intermediate', 'upper-intermediate', 'advanced'],
    default: 'beginner'
  },
  schedule: {
    days: [String], // ['Monday', 'Wednesday', 'Friday']
    time: String, // '10:00 AM'
    duration: Number // in minutes
  },
  maxStudents: {
    type: Number,
    default: 30
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Generate unique enrollment code
classSchema.pre('save', function(next) {
  if (!this.enrollmentCode) {
    this.enrollmentCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Class', classSchema);