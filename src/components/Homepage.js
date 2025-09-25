import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTachometerAlt, 
  faFileAlt, 
  faList, 
  faFlask,
  faChartLine,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';

const Homepage = () => {
  return (
    <div className="container-fluid px-2">
      {/* Header Section - Exact match to Flask template */}
      <div className="text-center mb-4 mb-md-5">
        <img 
          src="/logo.png" 
          alt="Vitrag Associates Logo" 
          height="100" 
          className="mb-3 d-none d-md-block"
        />
        <img 
          src="/logo.png" 
          alt="Vitrag Associates Logo" 
          height="80" 
          className="mb-3 d-md-none"
        />
        <h1 className="display-5 display-md-4 fw-bold" style={{ color: '#FFD700' }}>
          Vitrag Associates LLP
        </h1>
        <p className="lead fs-6 fs-md-5" style={{ color: '#FFA500' }}>
          Construction Material Testing Laboratory
        </p>
      </div>

      {/* Welcome Section - Clean design without cards */}
      <div className="row justify-content-center mb-4 mb-md-5">
        <div className="col-12 col-lg-10 text-center">
          <h2 className="mb-3 mb-md-4 h4 h-md-2">
            Welcome to the Material Testing Portal
          </h2>
          <p className="fs-6">
            This application manages material testing requests for Vitrag Associates LLP's construction laboratory. 
            Our state-of-the-art facility provides comprehensive testing services for various construction materials.
          </p>
          <p className="fs-6">
            Submit test requests, track samples, and receive detailed reports for your construction projects
            through our easy-to-use digital platform.
          </p>
        </div>
      </div>

      {/* Service Cards - Clean design without card boxes */}
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3 g-md-4 mb-4 mb-md-5">
        <div className="col">
          <div className="text-center p-4">
            <i className="fas fa-tachometer-alt fa-3x mb-3 text-primary"></i>
            <h5>Dashboard</h5>
            <p>Monitor all tests with our tracking dashboard to manage your workflow.</p>
            <div className="d-flex flex-column gap-2 align-items-center">
              <Link to="/dashboard" className="btn btn-primary">
                View Dashboard
              </Link>
            </div>
          </div>
        </div>
        
        <div className="col">
          <div className="text-center p-4">
            <i className="fas fa-file-alt fa-3x mb-3 text-primary"></i>
            <h5>Submit Cube Test Request</h5>
            <p>Create a new sample cube test request for your construction materials.</p>
            <Link to="/test-request" className="btn btn-primary">
              New Cube Test Request
            </Link>
          </div>
        </div>
        
        <div className="col">
          <div className="text-center p-4">
            <i className="fas fa-list fa-3x mb-3 text-primary"></i>
            <h5>Sample Cube Test Record Register</h5>
            <p>View and manage your submitted cube test requests and samples.</p>
            <Link to="/samples" className="btn btn-primary">
              Sample Cube Test Record Register
            </Link>
          </div>
        </div>
      </div>

      {/* Other Testing Services Section - Clean design without card box */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="p-4">
            <div className="row align-items-center">
              <div className="col-lg-8">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-primary bg-opacity-10 rounded p-2 me-3">
                    <i className="fas fa-flask fa-lg text-primary"></i>
                  </div>
                  <div>
                    <h4 className="mb-1 fw-bold">Other Testing Services</h4>
                    <p className="text-muted mb-0">Comprehensive material testing solutions</p>
                  </div>
                </div>
                <p className="text-muted mb-0">
                  Explore our comprehensive range of construction material testing services beyond concrete cube testing. 
                  From aggregates to admixtures, we provide expert analysis for all your construction needs.
                </p>
              </div>
              <div className="col-lg-4 text-center">
                <Link to="/other-services" className="btn btn-primary btn-lg px-4 py-2">
                  <i className="fas fa-arrow-right me-2"></i>View All Services
                </Link>
                <div className="mt-2">
                  <small className="text-muted">
                    <i className="fas fa-chart-line me-1"></i>10% of our testing volume
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information - Clean design without card box */}
      <div className="row justify-content-center mb-5">
        <div className="col-md-10 text-center">
          <h3>Contact Information</h3>
          <p>
            <i className="fas fa-map-marker-alt me-2"></i> 34A/26 West, New Paccha peth, Ashok Chowk, Solapur
          </p>
          <p>
            <i className="fas fa-phone me-2"></i> 9552529235
          </p>
          <p>
            <i className="fas fa-envelope me-2"></i> vitragassociates3@gmail.com
          </p>
        </div>
      </div>

    </div>
  );
};

export default Homepage;
