import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import { Briefcase, Building, MapPin, DollarSign, Type, ArrowLeft, Loader2 } from 'lucide-react';

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-Time',
    salary: '',
    description: ''
  });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await api.get(`/jobs/${id}`);
        const { title, company, location, type, salary, description } = response.data;
        setFormData({ title, company, location, type, salary: salary || '', description });
      } catch (err) {
        setError('Failed to fetch job details');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError('');

    try {
      await api.put(`/jobs/${id}`, formData);
      navigate('/employer/dashboard');
    } catch (err) {
      if (err.response?.data?.errors) {
        setError(err.response.data.errors.map(e => e.msg).join(', '));
      } else {
        setError(err.response?.data?.error || 'Failed to update job');
      }
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex justify-center pt-20 bg-dark-bg text-primary-500">
       <Loader2 className="w-10 h-10 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-dark-bg p-4 sm:p-8">
      <div className="max-w-2xl mx-auto animate-fade-in-up">
        
        <button 
          onClick={() => navigate('/employer/dashboard')} 
          className="flex items-center gap-2 text-dark-muted hover:text-white transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Dashboard</span>
        </button>

        <div className="card">
          <h1 className="text-2xl font-bold text-white mb-6">Edit Job Listing</h1>

          {error && (
            <div className="bg-red-500/10 text-red-500 p-4 rounded-xl mb-6 border border-red-500/20">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-dark-muted mb-1">Job Title *</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-muted" />
                <input 
                  type="text" name="title" required
                  className="input-field pl-10" placeholder="e.g. Senior React Developer"
                  value={formData.title} onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-dark-muted mb-1">Company Name *</label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-muted" />
                  <input 
                    type="text" name="company" required
                    className="input-field pl-10" placeholder="e.g. Acme Corp"
                    value={formData.company} onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-muted mb-1">Location *</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-muted" />
                  <input 
                    type="text" name="location" required
                    className="input-field pl-10" placeholder="e.g. Remote, San Francisco"
                    value={formData.location} onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-dark-muted mb-1">Job Type *</label>
                <div className="relative">
                  <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-muted pointer-events-none" />
                  <select 
                    name="type" required
                    className="input-field pl-10 appearance-none cursor-pointer"
                    value={formData.type} onChange={handleChange}
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-muted mb-1">Salary Range (Optional)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-muted" />
                  <input 
                    type="text" name="salary"
                    className="input-field pl-10" placeholder="e.g. $100k - $120k"
                    value={formData.salary} onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-muted mb-1">Job Description *</label>
              <textarea 
                name="description" required rows="8"
                className="input-field" placeholder="Describe the role, responsibilities, and requirements..."
                value={formData.description} onChange={handleChange}
              ></textarea>
            </div>

            <div className="pt-4 flex justify-end">
              <button disabled={updating} type="submit" className="btn-primary w-full sm:w-auto px-8 py-3">
                {updating ? 'Updating...' : 'Update Job'}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};

export default EditJob;
