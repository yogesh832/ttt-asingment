import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Mail, Lock, User, UserCircle, Building2 } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('candidate');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    
    try {
      await register(name, email, password, role);
      navigate('/');
    } catch (err) {
      if (err.response?.data?.errors) {
        setError(err.response.data.errors.map(e => e.msg).join(', '));
      } else {
        setError(err.response?.data?.error || 'Failed to register');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg p-4 py-12">
      <div className="absolute top-0 w-full h-1/2 bg-gradient-to-b from-primary-900/20 to-transparent -z-10 pointer-events-none"></div>
      
      <div className="card w-full max-w-md animate-fade-in-up">
        <div className="flex justify-center mb-8">
          <div className="bg-primary-500/10 p-4 rounded-2xl border border-primary-500/20">
             <Briefcase className="w-10 h-10 text-primary-500" />
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-center mb-2">Create Account</h2>
        <p className="text-dark-muted text-center mb-8">Join the best job board community</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              type="button"
              onClick={() => setRole('candidate')}
              className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                role === 'candidate' 
                  ? 'border-primary-500 bg-primary-500/10 text-primary-500' 
                  : 'border-dark-border bg-dark-bg text-dark-muted hover:border-dark-muted'
              }`}
            >
              <UserCircle className="w-6 h-6" />
              <span className="font-medium text-sm">Candidate</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('employer')}
              className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                role === 'employer' 
                  ? 'border-primary-500 bg-primary-500/10 text-primary-500' 
                  : 'border-dark-border bg-dark-bg text-dark-muted hover:border-dark-muted'
              }`}
            >
              <Building2 className="w-6 h-6" />
              <span className="font-medium text-sm">Employer</span>
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-muted mb-1">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-dark-muted" />
              </div>
              <input
                type="text"
                required
                className="input-field pl-10"
                placeholder={role === 'employer' ? "Company Name or Contact" : "John Doe"}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-muted mb-1">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-dark-muted" />
              </div>
              <input
                type="email"
                required
                className="input-field pl-10"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-muted mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-dark-muted" />
              </div>
              <input
                type="password"
                required
                minLength="6"
                className="input-field pl-10"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex justify-center py-3 mt-4"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-dark-muted">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-500 hover:text-primary-400 font-medium transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
