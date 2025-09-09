import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const BaseLayout = ({ children }) => {
  const location = useLocation();

  return (
    <>
      {/* Navigation - Exact match to Flask template */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <img 
              src="/logo.png" 
              alt="Vitrag Associates Logo" 
              height="40" 
              className="me-2 d-none d-sm-block"
            />
            <img 
              src="/logo.png" 
              alt="Vitrag Associates Logo" 
              height="32" 
              className="me-2 d-sm-none"
            />
            <span style={{ color: '#FFD700' }} className="d-none d-md-inline">
              Vitrag Associates LLP
            </span>
            <span style={{ color: '#FFD700' }} className="d-md-none">
              Vitrag
            </span>
          </Link>
          
          <button 
            className="navbar-toggler border-0" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link 
                  className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} 
                  to="/"
                >
                  <i className="fas fa-home me-2"></i>
                  <span className="d-lg-inline">Home</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`} 
                  to="/dashboard"
                >
                  <i className="fas fa-tachometer-alt me-2"></i>
                  <span className="d-lg-inline">Dashboard</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link ${location.pathname === '/test-request' ? 'active' : ''}`} 
                  to="/test-request"
                >
                  <i className="fas fa-file-alt me-2"></i>
                  <span className="d-lg-inline d-none d-md-inline">New Cube Test</span>
                  <span className="d-md-none">Test</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link ${location.pathname === '/samples' ? 'active' : ''}`} 
                  to="/samples"
                >
                  <i className="fas fa-list me-2"></i>
                  <span className="d-lg-inline d-none d-md-inline">Sample Cube Test Register</span>
                  <span className="d-md-none">List</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link ${location.pathname === '/customers' ? 'active' : ''}`} 
                  to="/customers"
                >
                  <i className="fas fa-users me-2"></i>
                  <span className="d-lg-inline">Customers</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link ${location.pathname === '/other-services' ? 'active' : ''}`} 
                  to="/other-services"
                >
                  <i className="fas fa-tools me-2"></i>
                  <span className="d-lg-inline">Calibration</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Content - Exact match to Flask template */}
      <div className="container mt-4">
        {children}
      </div>

      {/* Footer - Exact match to Flask template */}
      <footer className="footer mt-5 py-3 bg-dark">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <p className="text-muted">
                &copy; 2025 <span style={{ color: '#FFD700' }}>Vitrag Associates LLP</span>. All rights reserved.
              </p>
            </div>
            <div className="col-md-6 text-md-end">
              <p className="text-muted">
                <span style={{ color: '#FFA500' }}>Construction Material Testing Laboratory</span>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default BaseLayout;
