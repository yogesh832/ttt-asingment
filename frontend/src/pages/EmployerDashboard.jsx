import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { PlusCircle, ExternalLink, Users, Trash2, Edit, Briefcase } from 'lucide-react';

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchJobs = async () => {
    try {
      const response = await api.get('/jobs/employer/my');
      setJobs(response.data);
    } catch (err) {
      setError('Failed to fetch your jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await api.delete(`/jobs/${id}`);
        setJobs(jobs.filter(job => job._id !== id));
      } catch (err) {
        alert('Failed to delete job');
      }
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg p-4 sm:p-8">
      <div className="max-w-6xl mx-auto animate-fade-in-up">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Employer Dashboard</h1>
            <p className="text-dark-muted">Manage your job listings and view applications</p>
          </div>
          <Link to="/employer/jobs/new" className="btn-primary flex items-center gap-2">
            <PlusCircle className="w-5 h-5" />
            <span>Post New Job</span>
          </Link>
        </div>

        {error && (
          <div className="bg-red-500/10 text-red-500 p-4 rounded-xl mb-6">{error}</div>
        )}

        {loading ? (
           <div className="flex justify-center py-10">
              <div className="w-8 h-8 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin"></div>
           </div>
        ) : jobs.length === 0 ? (
          <div className="card text-center py-16 border-dashed">
            <div className="inline-flex bg-dark-bg p-4 rounded-full mb-4">
              <Briefcase className="w-8 h-8 text-dark-muted" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">No jobs posted yet</h3>
            <p className="text-dark-muted mb-6">Create your first job listing to start receiving applications</p>
            <Link to="/employer/jobs/new" className="btn-primary inline-flex items-center gap-2">
              <PlusCircle className="w-5 h-5" /> Post Job
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {jobs.map(job => (
              <div key={job._id} className="card flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-primary-500/30 transition-colors">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1"><Link to={`/jobs/${job._id}`} className="hover:text-primary-400 truncate">{job.title}</Link></h3>
                  <div className="flex flex-wrap gap-2 text-sm text-dark-muted">
                    <span className="bg-dark-bg px-2 py-1 rounded">{job.type}</span>
                    <span className="bg-dark-bg px-2 py-1 rounded">{job.location}</span>
                    <span className="bg-dark-bg px-2 py-1 rounded">Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Link to={`/employer/jobs/${job._id}/applications`} className="btn-secondary whitespace-nowrap flex-1 sm:flex-none flex items-center justify-center gap-2">
                    <Users className="w-4 h-4" />
                    Applications
                  </Link>
                  <Link target="_blank" rel="noopener noreferrer" to={`/jobs/${job._id}`} className="p-2 text-dark-muted hover:text-white transition-colors border border-transparent hover:bg-dark-border rounded-lg" title="View Public Posting">
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  <Link to={`/employer/jobs/${job._id}/edit`} className="p-2 text-dark-muted hover:text-primary-400 transition-colors border border-transparent hover:bg-primary-500/10 rounded-lg" title="Edit Job">
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button onClick={() => handleDelete(job._id)} className="p-2 text-dark-muted hover:text-red-400 transition-colors border border-transparent hover:bg-red-500/10 rounded-lg" title="Delete Job">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerDashboard;
