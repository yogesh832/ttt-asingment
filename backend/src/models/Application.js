const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    jobId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Job', 
      required: true 
    },
    candidateId: { type: String, required: true }, // PostgreSQL User UUID
    name: { type: String, required: true },
    email: { type: String, required: true },
    coverLetter: { type: String, required: true },
    resumeUrl: { type: String }, // Optional link to resume
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'accepted', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Application', applicationSchema);
