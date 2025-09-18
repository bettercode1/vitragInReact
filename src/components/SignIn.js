import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import './SignIn.css';

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'quality-manager'
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle sign in logic here
    console.log('Sign in data:', formData);
    // For now, just navigate to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="signin-container">
      <Container fluid className="h-100">
        <Row className="h-100">
          {/* Left Section - Lottie Animation */}
          <Col lg={8} className="logo-section d-flex">
            <div className="logo-content">
              {/* Vitrag Logo */}
              <div className="vitrag-logo-container">
                <img 
                  src="/logo.png" 
                  alt="Vitrag Associates" 
                  className="vitrag-logo"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
              
              <DotLottieReact
                src="https://lottie.host/f9426c8a-f34e-409c-811a-0501266eb23a/b2oojgjcQn.lottie"
                loop
                autoplay
                className="lottie-animation"
              />
            </div>
          </Col>

          {/* Right Section - Login Form */}
          <Col lg={4} className="form-section d-flex align-items-center">
            <div className="form-container">

              {/* Welcome Message */}
              <div className="welcome-section mb-4">
                <h2 className="welcome-title">Welcome to <span className="company-name"><span className="vitrag-text">VITRAG</span> ASSOCIATES LLP - TESTING LAB</span></h2>
              </div>

              {/* Login Form */}
              <Card className="login-card">
                <Card.Body className="p-4">
                  <Form onSubmit={handleSubmit}>
                    {/* User Type Selection */}
                    <div className="user-type-selection mb-4">
                      <div className="d-flex gap-4">
                        <Form.Check
                          type="radio"
                          id="quality-manager"
                          name="userType"
                          value="quality-manager"
                          label="Quality Manager"
                          checked={formData.userType === 'quality-manager'}
                          onChange={handleInputChange}
                          className="user-type-radio"
                        />
                        <Form.Check
                          type="radio"
                          id="admin"
                          name="userType"
                          value="admin"
                          label="Admin"
                          checked={formData.userType === 'admin'}
                          onChange={handleInputChange}
                          className="user-type-radio"
                        />
                      </div>
                    </div>

                    {/* Email Field */}
                    <Form.Group className="mb-3">
                      <Form.Label className="form-label">EMAIL</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        className="form-input"
                        required
                      />
                    </Form.Group>

                    {/* Password Field */}
                    <Form.Group className="mb-4">
                      <Form.Label className="form-label">PASSWORD</Form.Label>
                      <div className="password-input-container">
                        <Form.Control
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="Enter your password"
                          className="form-input password-input"
                          required
                        />
                        <Button
                          type="button"
                          variant="link"
                          className="password-toggle"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </Button>
                      </div>
                    </Form.Group>

                    {/* Sign In Button */}
                    <Button
                      type="submit"
                      className="signin-button w-100"
                    >
                      Sign In
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SignIn;
