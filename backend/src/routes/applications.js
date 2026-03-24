const express = require('express');
const { body } = require('express-validator');
const { applyToJob, getMyApplications, getApplicationsForJob, updateApplicationStatus, getResume } = require('../controllers/applications');
const { verifyToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');
const { validateRequest } = require('../middleware/validate');
const upload = require('../config/upload');

const router = express.Router();

// Candidate Routes
router.post(
  '/',
  verifyToken,
  requireRole('candidate'),
  upload.single('resume'),
  [
    body('jobId').notEmpty().withMessage('Job ID is required'),
    body('name').notEmpty().withMessage('Name is required'),
    body('coverLetter').notEmpty().withMessage('Cover letter is required'),
  ],
  validateRequest,
  applyToJob
);

router.get('/my', verifyToken, requireRole('candidate'), getMyApplications);

// Employer Routes
router.get('/job/:jobId', verifyToken, requireRole('employer'), getApplicationsForJob);
router.get('/:id/resume', verifyToken, requireRole('employer'), getResume);

router.put(
  '/:id/status',
  verifyToken,
  requireRole('employer'),
  [
    body('status').isIn(['pending', 'reviewed', 'accepted', 'rejected']).withMessage('Invalid status'),
  ],
  validateRequest,
  updateApplicationStatus
);

module.exports = router;
