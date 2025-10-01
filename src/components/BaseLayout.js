import React, { useState } from 'react';
import { Navbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import SignOutConfirmation from './SignOutConfirmation';

const BaseLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  const handleSignOutClick = () => {
    setShowSignOutModal(true);
  };

  const handleSignOutConfirm = () => {
    setShowSignOutModal(false);
    // Navigate to sign in page and replace current history entry
    // This prevents the back button from returning to the previous page
    navigate('/signin', { replace: true });
  };

  const handleSignOutCancel = () => {
    setShowSignOutModal(false);
  };
  
  // Get logged in user info
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <>
      {/* Navigation - Exact match to Flask template */}
      <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#1C2333' }}>
        <div className="container-fluid px-3">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <img 
              src="/logo.png" 
              alt="Vitrag Associates Logo" 
              height="45" 
              className="me-3 d-none d-sm-block"
            />
            <img 
              src="/logo.png" 
              alt="Vitrag Associates Logo" 
              height="35" 
              className="me-2 d-sm-none"
            />
            <div className="d-flex flex-column">
              <span style={{ color: '#FFD700', fontSize: '1.1rem', fontWeight: '600', lineHeight: '1.2' }} className="d-none d-md-inline">
                Vitrag Associates LLP
              </span>
              <span style={{ color: '#FFD700', fontSize: '1.1rem', fontWeight: '600' }} className="d-md-none">
                Vitrag
              </span>
            </div>
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
            <ul className="navbar-nav mx-auto">
              <li className="nav-item mx-1">
                <Link 
                  className={`nav-link d-flex flex-column align-items-center py-2 px-3 ${location.pathname === '/' ? 'active' : ''}`} 
                  to="/"
                >
                  <i className="fas fa-home mb-1" style={{ fontSize: '1.2rem' }}></i>
                  <span className="d-lg-inline" style={{ fontSize: '0.9rem', fontWeight: '500' }}>Home</span>
                </Link>
              </li>
              <li className="nav-item mx-1">
                <Link 
                  className={`nav-link d-flex flex-column align-items-center py-2 px-3 ${location.pathname === '/dashboard' ? 'active' : ''}`} 
                  to="/dashboard"
                >
                  <i className="fas fa-tachometer-alt mb-1" style={{ fontSize: '1.2rem' }}></i>
                  <span className="d-lg-inline" style={{ fontSize: '0.9rem', fontWeight: '500' }}>Dashboard</span>
                </Link>
              </li>
              <li className="nav-item mx-1">
                <Link 
                  className={`nav-link d-flex flex-column align-items-center py-2 px-3 ${location.pathname === '/test-request' ? 'active' : ''}`} 
                  to="/test-request"
                >
                  <i className="fas fa-file-alt mb-1" style={{ fontSize: '1.2rem' }}></i>
                  <span className="d-lg-inline d-none d-md-inline" style={{ fontSize: '0.9rem', fontWeight: '500' }}>New Cube Test</span>
                  <span className="d-md-none" style={{ fontSize: '0.9rem', fontWeight: '500' }}>Test</span>
                </Link>
              </li>
              <li className="nav-item mx-1">
                <Link 
                  className={`nav-link d-flex flex-column align-items-center py-2 px-3 ${location.pathname === '/samples' ? 'active' : ''}`} 
                  to="/samples"
                >
                  <i className="fas fa-list mb-1" style={{ fontSize: '1.2rem' }}></i>
                  <span className="d-lg-inline d-none d-md-inline" style={{ fontSize: '0.9rem', fontWeight: '500' }}>Sample Cube Test Register</span>
                  <span className="d-md-none" style={{ fontSize: '0.9rem', fontWeight: '500' }}>List</span>
                </Link>
              </li>
              <li className="nav-item mx-1">
                <Link
                  className={`nav-link d-flex flex-column align-items-center py-2 px-3 ${location.pathname === '/customers' ? 'active' : ''}`} 
                  to="/customers"
                >
                  <i className="fas fa-users mb-1" style={{ fontSize: '1.2rem' }}></i>
                  <span className="d-lg-inline" style={{ fontSize: '0.9rem', fontWeight: '500' }}>Customers</span>
                </Link>
              </li>
              {/* <li className="nav-item">
                <Link 
                  className={`nav-link ${location.pathname === '/cube-testing-services' ? 'active' : ''}`} 
                  to="/cube-testing-services"
                >
                  <i className="fas fa-cube me-2"></i>
                  <span className="d-lg-inline">Cube Testing</span>
                </Link>
              </li> */}
              <li className="nav-item mx-1">
                <Link 
                  className={`nav-link d-flex flex-column align-items-center py-2 px-3 ${location.pathname === '/other-services' ? 'active' : ''}`} 
                  to="/other-services"
                >
                  <i className="fas fa-tools mb-1" style={{ fontSize: '1.2rem' }}></i>
                  <span className="d-lg-inline" style={{ fontSize: '0.9rem', fontWeight: '500' }}>Calibration</span>
                </Link>
              </li>
            </ul>
            
            {/* User Profile & Sign Out */}
            <div className="d-flex align-items-center ms-3 gap-2">
              {/* Profile Dropdown */}
              <Dropdown>
                <Dropdown.Toggle 
                  variant="outline-info" 
                  size="sm"
                  className="d-flex align-items-center px-3 py-2"
                  style={{
                    borderColor: '#0dcaf0',
                    color: '#0dcaf0',
                    backgroundColor: 'transparent',
                    borderRadius: '6px',
                    fontWeight: '500',
                    fontSize: '0.9rem'
                  }}
                >
                  <FontAwesomeIcon icon={faUser} className="me-2" />
                  <span className="d-none d-lg-inline">Profile</span>
                </Dropdown.Toggle>

                <Dropdown.Menu align="end" style={{ backgroundColor: '#2c3e50', border: '1px solid #0dcaf0' }}>
                  <Dropdown.Item disabled style={{ color: '#0dcaf0', fontWeight: 'bold' }}>
                    {user.role === 'quality-manager' ? 'Quality Manager' : user.full_name || 'User'}
                  </Dropdown.Item>
                  <Dropdown.Divider style={{ borderColor: '#0dcaf0' }} />
                  <Dropdown.Item disabled style={{ color: '#fff', fontSize: '0.85rem' }}>
                    <i className="fas fa-envelope me-2"></i>{user.email || 'N/A'}
                  </Dropdown.Item>
                  <Dropdown.Item disabled style={{ color: '#fff', fontSize: '0.85rem' }}>
                    <i className="fas fa-user-tag me-2"></i>Role: {user.role || 'N/A'}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              {/* Sign Out Button */}
              <Button
                variant="outline-danger"
                size="sm"
                onClick={handleSignOutClick}
                className="d-flex align-items-center px-3 py-2"
                style={{ 
                  borderColor: '#dc3545',
                  color: '#dc3545',
                  backgroundColor: 'transparent',
                  fontWeight: '500',
                  fontSize: '0.9rem',
                  borderRadius: '6px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#dc3545';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#dc3545';
                }}
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="me-2" style={{ fontSize: '0.9rem' }} />
                <span className="d-none d-lg-inline">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content - Exact match to Flask template */}
      <div className="container mt-4">
        {children}
      </div>

      {/* Footer - Exact match to Flask template */}
      <footer className="footer mt-5 py-3" style={{ backgroundColor: '#1C2333' }}>
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

      {/* Sign Out Confirmation Modal */}
      <SignOutConfirmation
        show={showSignOutModal}
        onHide={handleSignOutCancel}
        onConfirm={handleSignOutConfirm}
      />
    </>
  );
};

export default BaseLayout;
