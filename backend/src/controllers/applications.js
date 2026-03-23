const Application = require('../models/Application');
const Job = require('../models/Job');

const applyToJob = async (req, res) => {
  try {
    const { jobId, coverLetter, resumeUrl } = req.body;
    
    // Validate Job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found.' });
    }

    // Check if user already applied
    const existingApp = await Application.findOne({ jobId, candidateId: req.user.id });
    if (existingApp) {
      return res.status(400).json({ error: 'You have already applied to this job.' });
    }

    const application = new Application({
      jobId,
      candidateId: req.user.id,
      name: req.user.name || req.body.name, // Will ensure name is passed from frontend since JWT doesn't have it by default or update JWT payload
      email: req.user.email,
      coverLetter,
      resumeUrl,
    });

    // Wait, the JWT token only has { id, role, email }. 
    // We can fetch name from PG if needed, or require the frontend to send `name` in body.
    // Let's require it in body.
    if (!application.name && !req.body.name) {
       return res.status(400).json({ error: 'Applicant name is required.' });
    }
    application.name = application.name || req.body.name;

    await application.save();
    res.status(201).json(application);
  } catch (error) {
    console.error('Apply to Job Error:', error);
    res.status(500).json({ error: 'Internal server error while submitting application.' });
  }
};

const getMyApplications = async (req, res) => {
  try {
    // Populate job details
    const applications = await Application.find({ candidateId: req.user.id })
      .populate('jobId', 'title company location')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    console.error('Get My Applications Error:', error);
    res.status(500).json({ error: 'Internal server error while fetching my applications.' });
  }
};

const getApplicationsForJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Verify job belongs to Employer
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found.' });
    }

    if (job.postedBy !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to view these applications.' });
    }

    const applications = await Application.find({ jobId }).sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    console.error('Get Applications for Job Error:', error);
    res.status(500).json({ error: 'Internal server error while fetching applications.' });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'reviewed', 'accepted', 'rejected'].includes(status)) {
       return res.status(400).json({ error: 'Invalid status.' });
    }

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ error: 'Application not found.' });
    }

    // Verify employer owns the job this application is for
    const job = await Job.findById(application.jobId);
    if (!job || job.postedBy !== req.user.id) {
       return res.status(403).json({ error: 'Not authorized to update this application.' });
    }

    application.status = status;
    await application.save();

    res.json(application);
  } catch (error) {
    console.error('Update Application Status Error:', error);
    res.status(500).json({ error: 'Internal server error while updating application status.' });
  }
};

module.exports = {
  applyToJob,
  getMyApplications,
  getApplicationsForJob,
  updateApplicationStatus,
};
