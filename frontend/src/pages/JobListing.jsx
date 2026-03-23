import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import JobCard from '../components/JobCard';
import { Search, Filter, Loader2, RefreshCcw } from 'lucide-react';

const JobListing = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');

  const fetchJobs = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (keyword) params.append('keyword', keyword);
      if (location) params.append('location', location);
      if (type) params.append('type', type);

      const response = await api.get(`/jobs?${params.toString()}`);
      setJobs(response.data);
    } catch (err) {
      setError('Failed to fetch jobs.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const clearFilters = () => {
    setKeyword('');
    setLocation('');
    setType('');
    // Notice: calling fetchJobs immediately here wouldn't use the cleared state,
    // so we trigger a fresh fetch without params
    api.get('/jobs')
      .then(res => setJobs(res.data))
      .catch(err => setError('Failed to fetch jobs.'));
  };

  return (
    <div className="min-h-screen bg-dark-bg p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-4 animate-fade-in-up py-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">
            Find Your Dream Job
          </h1>
          <p className="text-dark-muted text-lg max-w-2xl mx-auto">
            Discover thousands of job opportunities with all the information you need. 
            Its your future. Come find it.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <form onSubmit={handleSearch} className="card flex flex-col md:flex-row gap-4 animate-fade-in-up delay-100 z-10 sticky top-20">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted w-5 h-5" />
            <input 
              type="text" 
              placeholder="Job title, keywords, or company" 
              className="input-field pl-10 h-12"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          
          <div className="w-full md:w-1/4 relative">
             <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted w-5 h-5 pointer-events-none" />
             <select 
               className="input-field pl-10 h-12 appearance-none cursor-pointer"
               value={location}
               onChange={(e) => setLocation(e.target.value)}
             >
               <option value="">Any Location</option>
               <option value="San Francisco">San Francisco</option>
               <option value="New York">New York</option>
               <option value="London">London</option>
               <option value="Remote">Remote</option>
             </select>
          </div>

          <div className="w-full md:w-1/4 relative">
             <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted w-5 h-5 pointer-events-none" />
             <select 
               className="input-field pl-10 h-12 appearance-none cursor-pointer"
               value={type}
               onChange={(e) => setType(e.target.value)}
             >
               <option value="">Any Type</option>
               <option value="Full-Time">Full-Time</option>
               <option value="Part-Time">Part-Time</option>
               <option value="Contract">Contract</option>
               <option value="Remote">Remote</option>
             </select>
          </div>

          <button type="submit" className="btn-primary h-12 px-8 flex items-center justify-center gap-2">
            Search
          </button>
          
          {(keyword || location || type) && (
            <button 
              type="button" 
              onClick={clearFilters}
              className="btn-secondary h-12 px-4 flex items-center justify-center gap-2"
              title="Clear filters"
            >
              <RefreshCcw className="w-4 h-4" />
            </button>
          )}
        </form>

        {/* Job Listings Grid */}
        <div className="animate-fade-in-up delay-200">
          {error && (
            <div className="bg-red-500/10 text-red-500 p-4 rounded-xl border border-red-500/20 text-center">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-dark-muted">
              <Loader2 className="w-10 h-10 animate-spin text-primary-500 mb-4" />
              <p>Fetching the latest jobs...</p>
            </div>
          ) : (
            <>
              {jobs.length === 0 && !error ? (
                <div className="card p-12 text-center text-dark-muted flex flex-col items-center justify-center border-dashed">
                   <div className="bg-dark-bg p-4 rounded-full mb-4">
                     <Search className="w-8 h-8 opacity-50" />
                   </div>
                   <h3 className="text-xl font-medium text-white mb-2">No jobs found</h3>
                   <p>Try adjusting your search or filters to find what you're looking for.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {jobs.map((job) => (
                    <div key={job._id} className="flex">
                       <JobCard job={job} />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobListing;
