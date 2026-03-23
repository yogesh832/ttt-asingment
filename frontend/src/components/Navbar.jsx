import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, LogOut, LayoutDashboard, UserCircle } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isEmployer, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="border-b border-dark-border bg-dark-bg/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 text-primary-500 hover:text-primary-400 transition-colors">
            <Briefcase className="w-8 h-8" />
            <span className="font-bold text-xl tracking-tight text-white">JobBoard</span>
          </Link>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <div className="hidden sm:flex items-center gap-2 mr-4">
                  <UserCircle className="w-5 h-5 text-dark-muted" />
                  <span className="text-sm font-medium text-dark-muted">{user?.name}</span>
                </div>

                {isEmployer ? (
                  <Link to="/employer/dashboard" className="btn-secondary flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4" />
                    <span className="hidden sm:inline">Dashboard</span>
                  </Link>
                ) : (
                  <Link to="/candidate/applications" className="btn-secondary flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    <span className="hidden sm:inline">My Applications</span>
                  </Link>
                )}
                
                <button onClick={handleLogout} className="text-dark-muted hover:text-red-400 transition-colors p-2">
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-dark-muted hover:text-white font-medium transition-colors px-4 py-2">
                  Log in
                </Link>
                <Link to="/register" className="btn-primary">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
