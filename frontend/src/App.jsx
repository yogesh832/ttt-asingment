import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import JobListing from './pages/JobListing';
import JobDetail from './pages/JobDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import EmployerDashboard from './pages/EmployerDashboard';
import CreateJob from './pages/CreateJob';
import JobApplications from './pages/JobApplications';
import MyApplications from './pages/MyApplications';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-dark-bg flex flex-col">
          <Navbar />
          <main className="flex-1 w-full">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<JobListing />} />
              <Route path="/jobs/:id" element={<JobDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Employer Protected Routes */}
              <Route element={<ProtectedRoute allowedRoles={['employer']} />}>
                <Route path="/employer/dashboard" element={<EmployerDashboard />} />
                <Route path="/employer/jobs/new" element={<CreateJob />} />
                <Route path="/employer/jobs/:id/applications" element={<JobApplications />} />
              </Route>

              {/* Candidate Protected Routes */}
              <Route element={<ProtectedRoute allowedRoles={['candidate']} />}>
                <Route path="/candidate/applications" element={<MyApplications />} />
              </Route>
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
