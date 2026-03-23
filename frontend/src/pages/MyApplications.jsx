import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Briefcase, Building, MapPin, Calendar, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const response = await api.get('/applications/my');
        setApplications(response.data);
      } catch (err) {
        setError('Failed to fetch your applications');
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'accepted': return <span className="badge badge-success flex items-center gap-1 w-max"><CheckCircle className="w-3 h-3"/> Accepted</span>;
      case 'rejected': return <span className="badge bg-red-500/10 text-red-500 border-red-500/20 flex items-center gap-1 w-max"><XCircle className="w-3 h-3"/> Rejected</span>;
      case 'reviewed': return <span className="badge bg-blue-500/10 text-blue-400 border-blue-500/20 flex items-center gap-1 w-max"><Eye className="w-3 h-3"/> Reviewed</span>;
      default: return <span className="badge badge-warning flex items-center gap-1 w-max"><Clock className="w-3 h-3"/> Pending</span>;
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg p-4 sm:p-8">
      <div className="max-w-5xl mx-auto animate-fade-in-up">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Applications</h1>
          <p className="text-dark-muted">Track the status of all jobs you have applied for.</p>
        </div>

        {error && <div className="bg-red-500/10 text-red-500 p-4 rounded-xl mb-6">{error}</div>}

        {loading ? (
           <div className="flex justify-center py-10">
              <div className="w-8 h-8 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin"></div>
           </div>
        ) : applications.length === 0 ? (
          <div className="card text-center py-16 border-dashed">
            <div className="inline-flex bg-dark-bg p-4 rounded-full mb-4">
              <Briefcase className="w-8 h-8 text-dark-muted" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">No applications yet</h3>
            <p className="text-dark-muted mb-6">Looks like you haven't applied to any jobs.</p>
            <Link to="/" className="btn-primary inline-flex items-center gap-2">
              <Briefcase className="w-4 h-4" /> Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {applications.map(app => (
              <Link to={`/jobs/${app.jobId?._id}`} key={app._id} className="block w-full group">
                <div className="card flex flex-col md:flex-row justify-between gap-6 hover:border-primary-500/50 transition-colors">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-primary-400 mb-1 transition-colors">
                          {app.jobId?.title || 'Unknown Job'}
                        </h3>
                        <div className="flex items-center gap-2 text-dark-muted">
                          <Building className="w-4 h-4" />
                          <span>{app.jobId?.company || 'Unknown Company'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm font-medium text-dark-muted">
                      <div className="flex items-center gap-1.5 bg-dark-bg px-2.5 py-1 rounded border border-dark-border">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{app.jobId?.location || 'Unknown'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-dark-bg px-2.5 py-1 rounded border border-dark-border">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Applied on {new Date(app.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center gap-2 border-t md:border-t-0 md:border-l border-dark-border pt-4 md:pt-0 md:pl-6 min-w-[140px]">
                    <span className="text-xs text-dark-muted font-medium mb-1 tracking-wider uppercase">Application Status</span>
                    {getStatusBadge(app.status)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
