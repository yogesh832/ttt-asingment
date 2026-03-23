const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    type: { 
      type: String, 
      enum: ['Full-Time', 'Part-Time', 'Contract', 'Remote'], 
      required: true 
    },
    salary: { type: String }, // e.g., "$80,000 - $100,000"
    postedBy: { type: String, required: true }, // PostgreSQL User UUID
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);
