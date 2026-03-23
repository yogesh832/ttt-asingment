const Job = require('../models/Job');

const createJob = async (req, res) => {
  try {
    const { title, company, description, location, type, salary } = req.body;
    
    // User ID comes from auth middleware
    const postedBy = req.user.id;

    const job = new Job({
      title,
      company,
      description,
      location,
      type,
      salary,
      postedBy,
    });

    await job.save();
    res.status(201).json(job);
  } catch (error) {
    console.error('Create Job Error:', error);
    res.status(500).json({ error: 'Internal server error while creating job.' });
  }
};

const getJobs = async (req, res) => {
  try {
    const { keyword, location, type } = req.query;
    const query = {};

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { company: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
      ];
    }
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    if (type) {
      query.type = type;
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    console.error('Get Jobs Error:', error);
    res.status(500).json({ error: 'Internal server error while fetching jobs.' });
  }
};

const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found.' });
    }
    res.json(job);
  } catch (error) {
    console.error('Get Job Error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Job not found.' });
    }
    res.status(500).json({ error: 'Internal server error while fetching job.' });
  }
};

const updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ error: 'Job not found.' });
    }

    // Check ownership
    if (job.postedBy !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this job.' });
    }

    job = await Job.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.json(job);
  } catch (error) {
    console.error('Update Job Error:', error);
    res.status(500).json({ error: 'Internal server error while updating job.' });
  }
};

const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ error: 'Job not found.' });
    }

    // Check ownership
    if (job.postedBy !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this job.' });
    }

    await job.deleteOne();
    res.json({ message: 'Job removed.' });
  } catch (error) {
    console.error('Delete Job Error:', error);
    res.status(500).json({ error: 'Internal server error while deleting job.' });
  }
};

const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    console.error('Get My Jobs Error:', error);
    res.status(500).json({ error: 'Internal server error while fetching my jobs.' });
  }
};

module.exports = {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getMyJobs,
};
