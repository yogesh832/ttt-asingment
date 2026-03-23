import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Building, DollarSign, Clock } from 'lucide-react';

const JobCard = ({ job }) => {
  const getTypeColor = (type) => {
    switch (type) {
      case 'Full-Time': return 'badge-success';
      case 'Part-Time': return 'badge-warning';
      case 'Contract': return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
      case 'Remote': return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      default: return 'badge-neutral';
    }
  };

  return (
    <Link to={`/jobs/${job._id}`} className="block w-full">
      <div className="card hover-lift h-full flex flex-col transition-colors hover:border-primary-500/50">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold text-white group-hover:text-primary-400 line-clamp-1 mb-1">
              {job.title}
            </h3>
            <div className="flex items-center gap-2 text-dark-muted text-sm">
              <Building className="w-4 h-4" />
              <span className="truncate max-w-[150px]">{job.company}</span>
            </div>
          </div>
          <span className={`badge ${getTypeColor(job.type)} whitespace-nowrap`}>
            {job.type}
          </span>
        </div>

        <p className="text-sm text-dark-muted mt-2 line-clamp-3 flex-grow mb-6">
          {job.description}
        </p>

        <div className="flex items-center justify-between border-t border-dark-border pt-4 mt-auto">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-xs font-medium text-dark-muted">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span className="truncate max-w-[100px]">{job.location}</span>
            </div>
            {job.salary && (
              <div className="flex items-center gap-1.5 text-green-400/80">
                <DollarSign className="w-3.5 h-3.5" />
                <span>{job.salary}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-dark-muted">
            <Clock className="w-3.5 h-3.5" />
            <span>{new Date(job.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default JobCard;
