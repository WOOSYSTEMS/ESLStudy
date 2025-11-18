const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['essay', 'grammar', 'vocabulary', 'listening', 'speaking', 'reading'],
    required: true
  },
  points: {
    type: Number,
    default: 100
  },
  dueDate: {
    type: Date,
    required: true
  },
  attachments: [String],
  submissions: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    content: String,
    attachments: [String],
    submittedAt: {
      type: Date,
      default: Date.now
    },
    grade: Number,
    feedback: String,
    gradedAt: Date
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Assignment', assignmentSchema);