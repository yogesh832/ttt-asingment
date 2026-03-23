import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { 
  Briefcase, MapPin, Building, DollarSign, Clock, 
  ArrowLeft, CheckCircle 
} from 'lucide-react';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isCandidate, isAuthenticated } = useAuth();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Application state
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyError, setApplyError] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await api.get(`/jobs/${id}`);
        setJob(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch job details');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    setApplying(true);
    setApplyError('');
    
    try {
      const formData = new FormData();
      formData.append('jobId', id);
      formData.append('name', user.name);
      formData.append('coverLetter', coverLetter);
      if (resumeFile) {
        formData.append('resume', resumeFile);
      }

      await api.post('/applications', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setApplySuccess(true);
      setShowApplyModal(false);
    } catch (err) {
      setApplyError(err.response?.data?.error || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex justify-center pt-20 bg-dark-bg text-primary-500">
       <div className="w-10 h-10 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-dark-bg p-8 text-center">
       <div className="card max-w-lg mx-auto border-red-500/30 bg-red-500/5">
         <h2 className="text-xl text-red-400 mb-4">{error}</h2>
         <button onClick={() => navigate(-1)} className="btn-secondary">Go Back</button>
       </div>
    </div>
  );

  if (!job) return null;

  return (
    <div className="min-h-screen bg-dark-bg p-4 sm:p-8 relative">
      <div className="max-w-4xl mx-auto animate-fade-in-up">
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 text-dark-muted hover:text-white transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Jobs</span>
        </button>

        <div className="card mb-8 sticky top-20 z-10 backdrop-blur-md bg-dark-card/90">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{job.title}</h1>
              <div className="flex items-center gap-2 text-primary-400 text-lg mb-4">
                <Building className="w-5 h-5" />
                <span>{job.company}</span>
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm text-dark-muted font-medium">
                <div className="flex items-center gap-1.5 border border-dark-border px-3 py-1.5 rounded-lg bg-dark-bg">
                  <MapPin className="w-4 h-4" />
                  <span>{job.location}</span>
                </div>
                {job.salary && (
                  <div className="flex items-center gap-1.5 border border-dark-border px-3 py-1.5 rounded-lg bg-dark-bg">
                    <DollarSign className="w-4 h-4 text-green-400" />
                    <span>{job.salary}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 border border-dark-border px-3 py-1.5 rounded-lg bg-dark-bg">
                  <Briefcase className="w-4 h-4" />
                  <span>{job.type}</span>
                </div>
                <div className="flex items-center gap-1.5 border border-dark-border px-3 py-1.5 rounded-lg bg-dark-bg">
                  <Clock className="w-4 h-4" />
                  <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0">
              {applySuccess ? (
                <div className="flex items-center gap-2 text-green-400 bg-green-500/10 px-6 py-3 rounded-xl border border-green-500/20">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold text-lg">Applied</span>
                </div>
              ) : (
                <button 
                  onClick={() => {
                    if (!isAuthenticated) navigate('/login');
                    else if (isCandidate) setShowApplyModal(true);
                  }}
                  disabled={isAuthenticated && !isCandidate}
                  className="btn-primary w-full md:w-auto px-8 py-3 text-lg"
                  title={isAuthenticated && !isCandidate ? "Only candidates can apply" : ""}
                >
                  {isAuthenticated ? (isCandidate ? "Apply Now" : "Employer Account") : "Login to Apply"}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-2xl font-bold text-white mb-6 border-b border-dark-border pb-4">Job Description</h2>
          <div className="prose prose-invert max-w-none text-dark-text leading-relaxed whitespace-pre-wrap">
            {job.description}
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="card w-full max-w-lg shadow-2xl scale-100">
            <h2 className="text-2xl font-bold mb-4">Apply for {job.title}</h2>
            <p className="text-dark-muted mb-6">at {job.company}</p>

            {applyError && (
              <div className="bg-red-500/10 text-red-500 border border-red-500/20 p-3 rounded-lg mb-4 text-sm">
                {applyError}
              </div>
            )}

            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-muted mb-1">Cover Letter *</label>
                <textarea 
                  required
                  rows="6"
                  className="input-field"
                  placeholder="Why are you a good fit for this role?"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-dark-muted mb-1">Resume (PDF, DOC) - Optional</label>
                <input 
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="input-field file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-500 file:text-white hover:file:bg-primary-600 cursor-pointer"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-dark-border">
                <button 
                  type="button" 
                  onClick={() => setShowApplyModal(false)}
                  className="btn-secondary"
                  disabled={applying}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={applying}
                >
                  {applying ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetail;
