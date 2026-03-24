const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, 'backend', '.env') });

const JobSchema = new mongoose.Schema({
  title: String,
  postedBy: String
}, { strict: false });

const Job = mongoose.model('Job', JobSchema);

async function checkJobs() {
  try {
    console.log('Connecting to:', process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected!');
    
    const count = await Job.countDocuments({});
    console.log('Total jobs in collection:', count);
    
    const jobs = await Job.find({});
    console.log('Jobs:', JSON.stringify(jobs, null, 2));
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkJobs();
