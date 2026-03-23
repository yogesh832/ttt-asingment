const request = require('supertest');
const express = require('express');
const jobsRouter = require('../routes/jobs');

// Mock mongoose Job model
jest.mock('../models/Job', () => {
  return {
    find: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockResolvedValue([
      { _id: '1', title: 'Software Engineer', company: 'Tech Inc' }
    ]),
    countDocuments: jest.fn().mockResolvedValue(1)
  };
});

const app = express();
app.use(express.json());
app.use('/api/jobs', jobsRouter);

describe('Jobs API', () => {
  it('should return paginated jobs list on GET /api/jobs', async () => {
    const res = await request(app).get('/api/jobs?page=1&limit=10');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('jobs');
    expect(res.body.jobs.length).toBe(1);
    expect(res.body.jobs[0].title).toBe('Software Engineer');
    expect(res.body.totalPages).toBe(1);
  });
});
