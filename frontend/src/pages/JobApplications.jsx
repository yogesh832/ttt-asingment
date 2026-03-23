import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { ArrowLeft, User, Mail, FileText, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';

const JobApplications = () => {
  const { id: jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appRes, jobRes] = await Promise.all([
          api.get(`/applications/job/${jobId}`),
          api.get(`/jobs/${jobId}`)
        ]);
        setApplications(appRes.data);
        setJob(jobRes.data);
      } catch (err) {
        setError('Failed to fetch applications or job details');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [jobId]);

  const updateStatus = async (appId, status) => {
    try {
      await api.put(`/applications/${appId}/status`, { status });
      setApplications(prev => prev.map(app => 
        app._id === appId ? { ...app, status } : app
      ));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'accepted': return <span className="badge badge-success flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Accepted</span>;
      case 'rejected': return <span className="badge bg-red-500/10 text-red-500 border-red-500/20 flex items-center gap-1"><XCircle className="w-3 h-3"/> Rejected</span>;
      case 'reviewed': return <span className="badge bg-blue-500/10 text-blue-400 border-blue-500/20 flex items-center gap-1"><Eye className="w-3 h-3"/> Reviewed</span>;
      default: return <span className="badge badge-warning flex items-center gap-1"><Clock className="w-3 h-3"/> Pending</span>;
    }
  };

  if (loading) return (
    <div className="min-h-screen flex justify-center pt-20 bg-dark-bg text-primary-500">
       <div className="w-10 h-10 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-dark-bg p-4 sm:p-8">
      <div className="max-w-6xl mx-auto animate-fade-in-up">
        
        <Link 
          to="/employer/dashboard" 
          className="flex items-center gap-2 text-dark-muted hover:text-white transition-colors mb-6 group w-max"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Applications for {job?.title}</h1>
          <p className="text-dark-muted">{applications.length} total candidates applied</p>
        </div>

        {error && <div className="bg-red-500/10 text-red-500 p-4 rounded-xl mb-6">{error}</div>}

        {applications.length === 0 ? (
          <div className="card text-center py-16 border-dashed">
            <div className="inline-flex bg-dark-bg p-4 rounded-full mb-4">
              <Users className="w-8 h-8 text-dark-muted" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">No applications yet</h3>
            <p className="text-dark-muted">Candidates haven't applied to this job yet.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {applications.map(app => (
              <div key={app._id} className="card flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-4">
                   <div className="flex justify-between items-start">
                     <div>
                       <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                         <User className="w-5 h-5 text-dark-muted" />
                         {app.name}
                       </h3>
                       <div className="flex items-center gap-2 text-dark-muted text-sm">
                         <Mail className="w-4 h-4" />
                         <a href={`mailto:${app.email}`} className="hover:text-primary-400">{app.email}</a>
                       </div>
                     </div>
                     {getStatusBadge(app.status)}
                   </div>

                   <div className="bg-dark-bg p-4 border border-dark-border rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-dark-muted mb-2 font-medium">
                        <FileText className="w-4 h-4" /> Cover Letter
                      </div>
                      <p className="text-dark-text text-sm whitespace-pre-wrap">{app.coverLetter}</p>
                   </div>
                   
                   {app.resumeUrl && (
                     <div className="pt-2">
                       <a 
                         href={app.resumeUrl} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="text-sm text-primary-500 hover:text-primary-400 inline-flex items-center gap-1 font-medium"
                       >
                         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                         View Attachment / Resume URL
                       </a>
                     </div>
                   )}
                </div>

                <div className="w-full md:w-48 flex flex-col gap-2 border-t md:border-t-0 md:border-l border-dark-border pt-4 md:pt-0 md:pl-6 justify-center">
                  <p className="text-xs text-dark-muted font-medium mb-1 tracking-wider uppercase">Update Status</p>
                  <button 
                    onClick={() => updateStatus(app._id, 'reviewed')}
                    disabled={app.status === 'reviewed'} 
                    className={`btn-secondary text-sm ${app.status === 'reviewed' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Mark Reviewed
                  </button>
                  <button 
                    onClick={() => updateStatus(app._id, 'accepted')}
                    disabled={app.status === 'accepted'} 
                    className={`px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-500 font-medium rounded-lg transition-colors border border-green-500/20 text-sm ${app.status === 'accepted' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Accept
                  </button>
                  <button 
                    onClick={() => updateStatus(app._id, 'rejected')}
                    disabled={app.status === 'rejected'} 
                    className={`px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-medium rounded-lg transition-colors border border-red-500/20 text-sm ${app.status === 'rejected' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Reject
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

// Also import Users if not imported above
import { Users } from 'lucide-react';
export default JobApplications;
