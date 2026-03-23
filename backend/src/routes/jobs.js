const express = require('express');
const { body } = require('express-validator');
const { createJob, getJobs, getJobById, updateJob, deleteJob, getMyJobs } = require('../controllers/jobs');
const { verifyToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');
const { validateRequest } = require('../middleware/validate');

const router = express.Router();

// Public routes
router.get('/', getJobs);
router.get('/:id', getJobById);

// Protected routes (Employer only)
router.post(
  '/',
  verifyToken,
  requireRole('employer'),
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('company').notEmpty().withMessage('Company is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('location').notEmpty().withMessage('Location is required'),
    body('type').isIn(['Full-Time', 'Part-Time', 'Contract', 'Remote']).withMessage('Valid job type is required'),
  ],
  validateRequest,
  createJob
);

router.get('/employer/my', verifyToken, requireRole('employer'), getMyJobs);

router.put('/:id', verifyToken, requireRole('employer'), updateJob);

router.delete('/:id', verifyToken, requireRole('employer'), deleteJob);

module.exports = router;
