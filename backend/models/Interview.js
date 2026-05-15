const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  application: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
  round:       { type: String, default: 'Round 1' },
  scheduledAt: { type: Date, required: true },
  mode:        { type: String, enum: ['Online', 'In-person', 'Phone'], default: 'Online' },
  notes:       { type: String },
  outcome:     { type: String, enum: ['Pending', 'Passed', 'Failed'], default: 'Pending' },
}, { timestamps: true });

module.exports = mongoose.model('Interview', interviewSchema);
