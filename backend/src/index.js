const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const env = require('./config/env');
const { connectDBs } = require('./config/db');

// Import Routes
const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const applicationRoutes = require('./routes/applications');

// Import Error Handlers
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Job Board API is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start Server
const startServer = async () => {
  try {
    await connectDBs();
    app.listen(env.port, () => {
      console.log(`Server listening on port ${env.port}`);
      
      // Keep-alive ping to prevent Render free tier from sleeping, which causes CORS/Timeout errors
      const testApiCall = () => {
        const https = require('https');
        https.get('https://ttt-asingment-ippg.onrender.com/', (res) => {
          console.log(`Self-ping status: ${res.statusCode}`);
        }).on('error', (err) => {
          console.error(`Self-ping error: ${err.message}`);
        });
      };
      
      console.log('Starting 5-second interval self-ping...');
      setInterval(testApiCall, 5000);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
