import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Modal, InputGroup, Alert, Spinner, Toast, ToastContainer } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faPlus, 
  faEdit, 
  faTrash, 
  faUsers,
  faFileAlt,
  faEye,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { getCustomers, addCustomer, updateCustomer, deleteCustomer } from '../apis/customers';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [phoneFilter, setPhoneFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addError, setAddError] = useState(null);
  const [editError, setEditError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [customerForm, setCustomerForm] = useState({
    first_name: '',
    last_name: '',
    name: '',
    contact_person: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    site_name: ''
  });

  // Fetch customers from API
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCustomers();
      setCustomers(data);
    } catch (err) {
      setError('Failed to fetch customers');
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  // Refresh data when component mounts
  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(customer => {
    const fullName = `${customer.first_name || ''} ${customer.last_name || ''}`.trim();
    const customerName = customer.name || '';
    const contactPerson = customer.contact_person || '';
    
    // Search logic: "starts with" for all text fields
    const matchesSearch = 
      (searchTerm === '' || 
       fullName.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
       customerName.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
       contactPerson.toLowerCase().startsWith(searchTerm.toLowerCase()));
    
    const matchesPhone = !phoneFilter || (customer.phone || '').startsWith(phoneFilter);
    const matchesCity = !cityFilter || (customer.city || '').toLowerCase().startsWith(cityFilter.toLowerCase());
    
    return matchesSearch && matchesPhone && matchesCity;
  }).sort((a, b) => {
    // Sort alphabetically by customer name (name field)
    const nameA = (a.name || '').toLowerCase();
    const nameB = (b.name || '').toLowerCase();
    return nameA.localeCompare(nameB);
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddCustomer = async () => {
    // Validate required fields
    if (!customerForm.first_name || !customerForm.last_name || !customerForm.contact_person || !customerForm.phone || !customerForm.address || !customerForm.city || !customerForm.site_name) {
      setAddError('Please fill in all required fields.');
      return;
    }
    
    setIsSubmitting(true);
    setAddError(null);
    
    try {
      // Auto-generate name from first_name + last_name
      const formDataWithName = {
        ...customerForm,
        name: `${customerForm.first_name} ${customerForm.last_name}`.trim()
      };
      
      await addCustomer(formDataWithName);
      // Refresh the data after adding
      await fetchCustomers();
      setShowAddModal(false);
      setAddError(null);
      setCustomerForm({
        first_name: '',
        last_name: '',
        name: '',
        contact_person: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        site_name: ''
      });
      // Show success toast
      setSuccessMessage('Customer added successfully!');
      setShowSuccessToast(true);
    } catch (error) {
      console.error('Error adding customer:', error);
      if (error.response && error.response.data && error.response.data.error) {
        setAddError(error.response.data.error);
      } else {
        setAddError('Failed to add customer. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditCustomer = (customer) => {
    setSelectedCustomer(customer);
    setCustomerForm(customer);
    setShowEditModal(true);
  };

  const handleUpdateCustomer = async () => {
    if (!selectedCustomer) return;
    
    // Validate required fields
    if (!customerForm.first_name || !customerForm.last_name || !customerForm.contact_person || !customerForm.phone || !customerForm.address || !customerForm.city || !customerForm.site_name) {
      setEditError('Please fill in all required fields.');
      return;
    }
    
    setIsSubmitting(true);
    setEditError(null);
    
    try {
      // Auto-generate name from first_name + last_name
      const formDataWithName = {
        ...customerForm,
        name: `${customerForm.first_name} ${customerForm.last_name}`.trim()
      };
      
      await updateCustomer(selectedCustomer.id, formDataWithName);
      // Refresh the data after updating
      await fetchCustomers();
      setShowEditModal(false);
      setSelectedCustomer(null);
      setEditError(null);
      setCustomerForm({
        first_name: '',
        last_name: '',
        name: '',
        contact_person: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        site_name: ''
      });
      // Show success toast
      setSuccessMessage('Customer updated successfully!');
      setShowSuccessToast(true);
    } catch (error) {
      console.error('Error updating customer:', error);
      if (error.response && error.response.data && error.response.data.error) {
        setEditError(error.response.data.error);
      } else {
        setEditError('Failed to update customer. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedCustomer) return;
    
    setIsSubmitting(true);
    setDeleteError(null);
    
    try {
      await deleteCustomer(selectedCustomer.id);
      // Refresh the data after deleting
      await fetchCustomers();
      setShowDeleteModal(false);
      setSelectedCustomer(null);
      setDeleteError(null);
      // Show success toast
      setSuccessMessage('Customer deleted successfully!');
      setShowSuccessToast(true);
    } catch (error) {
      console.error('Error deleting customer:', error);
      let errorMessage = 'Failed to delete customer. Please try again.';
      
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error;
      }
      
      // If customer has test requests, show specific message
      if (errorMessage.includes('associated test requests')) {
        errorMessage = 'Cannot delete this customer because they have associated test requests. Please delete all test requests first.';
      }
      
      setDeleteError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setPhoneFilter('');
    setCityFilter('');
  };

  return (
    <div>
      <style>
        {`
          .custom-table-scroll::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          
          .custom-table-scroll::-webkit-scrollbar-track {
            background: #1C2333;
            border-radius: 4px;
          }
          
          .custom-table-scroll::-webkit-scrollbar-thumb {
            background: #3A4553;
            border-radius: 4px;
          }
          
          .custom-table-scroll::-webkit-scrollbar-thumb:hover {
            background: #4A5568;
          }

          @keyframes skeleton-pulse {
            0% {
              opacity: 1;
            }
            50% {
              opacity: 0.4;
            }
            100% {
              opacity: 1;
            }
          }

          /* Red asterisk for required fields */
          .form-label:after {
            content: '';
          }
          
          .form-label:has(+ .form-control[required]):after,
          .form-label:has(+ textarea[required]):after {
            content: ' *';
            color: #DC3545;
            font-weight: bold;
          }
        `}
      </style>
      {/* Header */}
      <div className="header-vitrag">
        <Container>
          <Row className="align-items-center">
            <Col md={8}>
              <div className="d-flex align-items-center">
                <FontAwesomeIcon icon={faUsers} className="me-3" style={{ fontSize: '2rem' }} />
                <h1 style={{ color: 'var(--vitrag-gold)', fontWeight: '700', margin: 0 }}>
                  Customer Management
                </h1>
              </div>
            </Col>
            <Col md={4} className="text-end">
              <Button 
                variant="primary" 
                className="btn-vitrag-primary"
                onClick={() => setShowAddModal(true)}
              >
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Add New User
              </Button>
            </Col>
          </Row>
        </Container>
      </div>

      <Container>
        {/* Search Section */}
        <Card className="card-vitrag mb-4" style={{ 
          backgroundColor: '#1C2333', 
          border: '1px solid #3A4553',
          borderRadius: '12px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
        }}>
          <Card.Body style={{ padding: '25px' }}>
            <Row className="align-items-end">
              <Col md={4} className="mb-3">
                <Form.Group>
                  <Form.Label style={{ color: '#FFFFFF', fontWeight: '600', marginBottom: '8px' }}>Customer Name</Form.Label>
                  <InputGroup>
                    <InputGroup.Text style={{ 
                      backgroundColor: '#2A3441', 
                      borderColor: '#3A4553', 
                      color: '#FFFFFF' 
                    }}>
                      <FontAwesomeIcon icon={faSearch} />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Search by customer name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        backgroundColor: '#2A3441',
                        borderColor: '#3A4553',
                        color: '#FFFFFF',
                        borderRadius: '0 6px 6px 0'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#4A90E2';
                        e.target.style.boxShadow = '0 0 0 0.2rem rgba(74, 144, 226, 0.25)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#3A4553';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={3} className="mb-3">
                <Form.Group>
                  <Form.Label style={{ color: '#FFFFFF', fontWeight: '600', marginBottom: '8px' }}>Phone Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Search by phone..."
                    value={phoneFilter}
                    onChange={(e) => setPhoneFilter(e.target.value)}
                    style={{
                      backgroundColor: '#2A3441',
                      borderColor: '#3A4553',
                      color: '#FFFFFF',
                      borderRadius: '6px'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#4A90E2';
                      e.target.style.boxShadow = '0 0 0 0.2rem rgba(74, 144, 226, 0.25)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#3A4553';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </Form.Group>
              </Col>
              <Col md={3} className="mb-3">
                <Form.Group>
                  <Form.Label style={{ color: '#FFFFFF', fontWeight: '600', marginBottom: '8px' }}>City</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Search by city..."
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                    style={{
                      backgroundColor: '#2A3441',
                      borderColor: '#3A4553',
                      color: '#FFFFFF',
                      borderRadius: '6px'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#4A90E2';
                      e.target.style.boxShadow = '0 0 0 0.2rem rgba(74, 144, 226, 0.25)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#3A4553';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </Form.Group>
              </Col>
              <Col md={2} className="mb-3">
                <Button
                  variant="outline-secondary"
                  onClick={resetFilters}
                  className="w-100"
                  style={{
                    backgroundColor: 'transparent',
                    borderColor: '#6C757D',
                    color: '#6C757D',
                    borderRadius: '6px',
                    fontWeight: '600',
                    padding: '10px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#6C757D';
                    e.target.style.color = '#FFFFFF';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#6C757D';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  Reset
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert variant="danger" className="mb-4">
            <FontAwesomeIcon icon={faUsers} className="me-2" />
            Error loading customers: {error}
          </Alert>
        )}

        {/* Customers Table */}
        <Card className="card-vitrag" style={{ 
          backgroundColor: '#1C2333', 
          border: '1px solid #3A4553',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          overflow: 'hidden'
        }}>
          <Card.Body className="p-0">
            {loading ? (
              <div className="table-responsive custom-table-scroll" style={{ 
                backgroundColor: '#1C2333', 
                borderRadius: '8px', 
                overflow: 'auto',
                maxHeight: '70vh',
                minHeight: '400px',
                scrollbarWidth: 'thin',
                scrollbarColor: '#3A4553 #1C2333'
              }}>
                <Table className="table-vitrag mb-0" style={{ 
                  backgroundColor: '#1C2333', 
                  marginBottom: 0,
                  borderCollapse: 'separate',
                  borderSpacing: 0,
                  minWidth: '1200px'
                }}>
                  <thead style={{ backgroundColor: '#2A3441' }}>
                    <tr>
                      <th style={{ 
                        padding: '20px 15px', 
                        color: '#FFFFFF', 
                        fontWeight: '600', 
                        fontSize: '14px',
                        borderBottom: '2px solid #3A4553',
                        borderRight: '1px solid #3A4553',
                        backgroundColor: '#2A3441'
                      }}>Sr. No.</th>
                      <th style={{ 
                        padding: '20px 15px', 
                        color: '#FFFFFF', 
                        fontWeight: '600', 
                        fontSize: '14px',
                        borderBottom: '2px solid #3A4553',
                        borderRight: '1px solid #3A4553',
                        backgroundColor: '#2A3441'
                      }}>First Name</th>
                      <th style={{ 
                        padding: '20px 15px', 
                        color: '#FFFFFF', 
                        fontWeight: '600', 
                        fontSize: '14px',
                        borderBottom: '2px solid #3A4553',
                        borderRight: '1px solid #3A4553',
                        backgroundColor: '#2A3441'
                      }}>Last Name</th>
                      <th style={{ 
                        padding: '20px 15px', 
                        color: '#FFFFFF', 
                        fontWeight: '600', 
                        fontSize: '14px',
                        borderBottom: '2px solid #3A4553',
                        borderRight: '1px solid #3A4553',
                        backgroundColor: '#2A3441'
                      }}>Contact Person</th>
                      <th style={{ 
                        padding: '20px 15px', 
                        color: '#FFFFFF', 
                        fontWeight: '600', 
                        fontSize: '14px',
                        borderBottom: '2px solid #3A4553',
                        borderRight: '1px solid #3A4553',
                        backgroundColor: '#2A3441'
                      }}>Phone</th>
                      <th style={{ 
                        padding: '20px 15px', 
                        color: '#FFFFFF', 
                        fontWeight: '600', 
                        fontSize: '14px',
                        borderBottom: '2px solid #3A4553',
                        borderRight: '1px solid #3A4553',
                        backgroundColor: '#2A3441'
                      }}>Email</th>
                      <th style={{ 
                        padding: '20px 15px', 
                        color: '#FFFFFF', 
                        fontWeight: '600', 
                        fontSize: '14px',
                        borderBottom: '2px solid #3A4553',
                        borderRight: '1px solid #3A4553',
                        backgroundColor: '#2A3441'
                      }}>Address</th>
                      <th style={{ 
                        padding: '20px 15px', 
                        color: '#FFFFFF', 
                        fontWeight: '600', 
                        fontSize: '14px',
                        borderBottom: '2px solid #3A4553',
                        borderRight: '1px solid #3A4553',
                        backgroundColor: '#2A3441'
                      }}>City</th>
                      <th style={{ 
                        padding: '20px 15px', 
                        color: '#FFFFFF', 
                        fontWeight: '600', 
                        fontSize: '14px',
                        borderBottom: '2px solid #3A4553',
                        borderRight: '1px solid #3A4553',
                        backgroundColor: '#2A3441'
                      }}>Site Name</th>
                      <th style={{ 
                        padding: '20px 15px', 
                        color: '#FFFFFF', 
                        fontWeight: '600', 
                        fontSize: '14px',
                        borderBottom: '2px solid #3A4553',
                        backgroundColor: '#2A3441'
                      }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...Array(5)].map((_, index) => (
                      <tr key={index} style={{ 
                        backgroundColor: index % 2 === 0 ? '#1C2333' : '#232B3A',
                        borderBottom: '1px solid #3A4553'
                      }}>
                        <td style={{ 
                          padding: '25px 15px', 
                          borderRight: '1px solid #3A4553',
                          borderBottom: '1px solid #3A4553'
                        }}>
                          <div className="skeleton-line" style={{
                            height: '20px',
                            backgroundColor: '#3A4553',
                            borderRadius: '4px',
                            animation: 'skeleton-pulse 1.5s ease-in-out infinite',
                            width: '30px',
                            margin: '0 auto'
                          }}></div>
                        </td>
                        <td style={{ 
                          padding: '25px 15px', 
                          borderRight: '1px solid #3A4553',
                          borderBottom: '1px solid #3A4553'
                        }}>
                          <div className="skeleton-line" style={{
                            height: '20px',
                            backgroundColor: '#3A4553',
                            borderRadius: '4px',
                            animation: 'skeleton-pulse 1.5s ease-in-out infinite',
                            width: '80px'
                          }}></div>
                        </td>
                        <td style={{ 
                          padding: '25px 15px', 
                          borderRight: '1px solid #3A4553',
                          borderBottom: '1px solid #3A4553'
                        }}>
                          <div className="skeleton-line" style={{
                            height: '20px',
                            backgroundColor: '#3A4553',
                            borderRadius: '4px',
                            animation: 'skeleton-pulse 1.5s ease-in-out infinite',
                            width: '80px'
                          }}></div>
                        </td>
                        <td style={{ 
                          padding: '25px 15px', 
                          borderRight: '1px solid #3A4553',
                          borderBottom: '1px solid #3A4553'
                        }}>
                          <div className="skeleton-line" style={{
                            height: '20px',
                            backgroundColor: '#3A4553',
                            borderRadius: '4px',
                            animation: 'skeleton-pulse 1.5s ease-in-out infinite',
                            width: '100px'
                          }}></div>
                        </td>
                        <td style={{ 
                          padding: '25px 15px', 
                          borderRight: '1px solid #3A4553',
                          borderBottom: '1px solid #3A4553'
                        }}>
                          <div className="skeleton-line" style={{
                            height: '20px',
                            backgroundColor: '#3A4553',
                            borderRadius: '4px',
                            animation: 'skeleton-pulse 1.5s ease-in-out infinite',
                            width: '120px'
                          }}></div>
                        </td>
                        <td style={{ 
                          padding: '25px 15px', 
                          borderRight: '1px solid #3A4553',
                          borderBottom: '1px solid #3A4553'
                        }}>
                          <div className="skeleton-line" style={{
                            height: '20px',
                            backgroundColor: '#3A4553',
                            borderRadius: '4px',
                            animation: 'skeleton-pulse 1.5s ease-in-out infinite',
                            width: '150px'
                          }}></div>
                        </td>
                        <td style={{ 
                          padding: '25px 15px', 
                          borderRight: '1px solid #3A4553',
                          borderBottom: '1px solid #3A4553'
                        }}>
                          <div className="skeleton-line" style={{
                            height: '20px',
                            backgroundColor: '#3A4553',
                            borderRadius: '4px',
                            animation: 'skeleton-pulse 1.5s ease-in-out infinite',
                            width: '120px'
                          }}></div>
                        </td>
                        <td style={{ 
                          padding: '25px 15px', 
                          borderRight: '1px solid #3A4553',
                          borderBottom: '1px solid #3A4553'
                        }}>
                          <div className="skeleton-line" style={{
                            height: '20px',
                            backgroundColor: '#3A4553',
                            borderRadius: '4px',
                            animation: 'skeleton-pulse 1.5s ease-in-out infinite',
                            width: '80px'
                          }}></div>
                        </td>
                        <td style={{ 
                          padding: '25px 15px', 
                          borderRight: '1px solid #3A4553',
                          borderBottom: '1px solid #3A4553'
                        }}>
                          <div className="skeleton-line" style={{
                            height: '20px',
                            backgroundColor: '#3A4553',
                            borderRadius: '4px',
                            animation: 'skeleton-pulse 1.5s ease-in-out infinite',
                            width: '100px'
                          }}></div>
                        </td>
                        <td style={{ 
                          padding: '25px 15px', 
                          borderBottom: '1px solid #3A4553'
                        }}>
                          <div className="d-flex gap-2 justify-content-center">
                            <div className="skeleton-line" style={{
                              height: '32px',
                              backgroundColor: '#3A4553',
                              borderRadius: '6px',
                              animation: 'skeleton-pulse 1.5s ease-in-out infinite',
                              width: '32px'
                            }}></div>
                            <div className="skeleton-line" style={{
                              height: '32px',
                              backgroundColor: '#3A4553',
                              borderRadius: '6px',
                              animation: 'skeleton-pulse 1.5s ease-in-out infinite',
                              width: '32px'
                            }}></div>
                            <div className="skeleton-line" style={{
                              height: '32px',
                              backgroundColor: '#3A4553',
                              borderRadius: '6px',
                              animation: 'skeleton-pulse 1.5s ease-in-out infinite',
                              width: '32px'
                            }}></div>
                            <div className="skeleton-line" style={{
                              height: '32px',
                              backgroundColor: '#3A4553',
                              borderRadius: '6px',
                              animation: 'skeleton-pulse 1.5s ease-in-out infinite',
                              width: '32px'
                            }}></div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            ) : (
              <div className="table-responsive custom-table-scroll" style={{ 
                backgroundColor: '#1C2333', 
                borderRadius: '8px', 
                overflow: 'auto',
                maxHeight: '70vh',
                minHeight: '400px',
                scrollbarWidth: 'thin',
                scrollbarColor: '#3A4553 #1C2333'
              }}>
                <Table className="table-vitrag mb-0" style={{ 
                  backgroundColor: '#1C2333', 
                  marginBottom: 0,
                  borderCollapse: 'separate',
                  borderSpacing: 0,
                  minWidth: '1200px'
                }}>
                  <thead style={{ backgroundColor: '#2A3441' }}>
                    <tr>
                      <th style={{ 
                        padding: '20px 15px', 
                        color: '#FFFFFF', 
                        fontWeight: '600', 
                        fontSize: '14px',
                        borderBottom: '2px solid #3A4553',
                        borderRight: '1px solid #3A4553',
                        backgroundColor: '#2A3441'
                      }}>Sr. No.</th>
                      <th style={{ 
                        padding: '20px 15px', 
                        color: '#FFFFFF', 
                        fontWeight: '600', 
                        fontSize: '14px',
                        borderBottom: '2px solid #3A4553',
                        borderRight: '1px solid #3A4553',
                        backgroundColor: '#2A3441'
                      }}>First Name</th>
                      <th style={{ 
                        padding: '20px 15px', 
                        color: '#FFFFFF', 
                        fontWeight: '600', 
                        fontSize: '14px',
                        borderBottom: '2px solid #3A4553',
                        borderRight: '1px solid #3A4553',
                        backgroundColor: '#2A3441'
                      }}>Last Name</th>
                      <th style={{ 
                        padding: '20px 15px', 
                        color: '#FFFFFF', 
                        fontWeight: '600', 
                        fontSize: '14px',
                        borderBottom: '2px solid #3A4553',
                        borderRight: '1px solid #3A4553',
                        backgroundColor: '#2A3441'
                      }}>Contact Person</th>
                      <th style={{ 
                        padding: '20px 15px', 
                        color: '#FFFFFF', 
                        fontWeight: '600', 
                        fontSize: '14px',
                        borderBottom: '2px solid #3A4553',
                        borderRight: '1px solid #3A4553',
                        backgroundColor: '#2A3441'
                      }}>Phone</th>
                      <th style={{ 
                        padding: '20px 15px', 
                        color: '#FFFFFF', 
                        fontWeight: '600', 
                        fontSize: '14px',
                        borderBottom: '2px solid #3A4553',
                        borderRight: '1px solid #3A4553',
                        backgroundColor: '#2A3441'
                      }}>Email</th>
                      <th style={{ 
                        padding: '20px 15px', 
                        color: '#FFFFFF', 
                        fontWeight: '600', 
                        fontSize: '14px',
                        borderBottom: '2px solid #3A4553',
                        borderRight: '1px solid #3A4553',
                        backgroundColor: '#2A3441'
                      }}>Address</th>
                      <th style={{ 
                        padding: '20px 15px', 
                        color: '#FFFFFF', 
                        fontWeight: '600', 
                        fontSize: '14px',
                        borderBottom: '2px solid #3A4553',
                        borderRight: '1px solid #3A4553',
                        backgroundColor: '#2A3441'
                      }}>City</th>
                      <th style={{ 
                        padding: '20px 15px', 
                        color: '#FFFFFF', 
                        fontWeight: '600', 
                        fontSize: '14px',
                        borderBottom: '2px solid #3A4553',
                        borderRight: '1px solid #3A4553',
                        backgroundColor: '#2A3441'
                      }}>Site Name</th>
                      <th style={{ 
                        padding: '20px 15px', 
                        color: '#FFFFFF', 
                        fontWeight: '600', 
                        fontSize: '14px',
                        borderBottom: '2px solid #3A4553',
                        backgroundColor: '#2A3441'
                      }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map((customer, index) => (
                      <tr key={customer.id} style={{ 
                        backgroundColor: index % 2 === 0 ? '#1C2333' : '#232B3A',
                        borderBottom: '1px solid #3A4553',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#2A3441';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#1C2333' : '#232B3A';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}>
                        <td style={{ 
                          padding: '25px 15px', 
                          color: '#FFFFFF', 
                          fontSize: '14px',
                          fontWeight: '500',
                          textAlign: 'center',
                          borderRight: '1px solid #3A4553',
                          borderBottom: '1px solid #3A4553'
                        }}>{index + 1}</td>
                        <td style={{ 
                          padding: '25px 15px', 
                          color: '#FFFFFF', 
                          fontSize: '14px',
                          fontWeight: '500',
                          borderRight: '1px solid #3A4553',
                          borderBottom: '1px solid #3A4553'
                        }}>{customer.first_name || 'N/A'}</td>
                        <td style={{ 
                          padding: '25px 15px', 
                          color: '#FFFFFF', 
                          fontSize: '14px',
                          fontWeight: '500',
                          borderRight: '1px solid #3A4553',
                          borderBottom: '1px solid #3A4553'
                        }}>{customer.last_name || 'N/A'}</td>
                        <td style={{ 
                          padding: '25px 15px', 
                          color: '#FFFFFF', 
                          fontSize: '14px',
                          fontWeight: '500',
                          borderRight: '1px solid #3A4553',
                          borderBottom: '1px solid #3A4553'
                        }}>{customer.contact_person || 'N/A'}</td>
                        <td style={{ 
                          padding: '25px 15px', 
                          color: '#FFFFFF', 
                          fontSize: '14px',
                          fontWeight: '500',
                          borderRight: '1px solid #3A4553',
                          borderBottom: '1px solid #3A4553'
                        }}>{customer.phone || 'N/A'}</td>
                        <td style={{ 
                          padding: '25px 15px', 
                          color: '#FFFFFF', 
                          fontSize: '14px',
                          fontWeight: '500',
                          borderRight: '1px solid #3A4553',
                          borderBottom: '1px solid #3A4553'
                        }}>{customer.email || 'N/A'}</td>
                        <td style={{ 
                          padding: '25px 15px', 
                          color: '#FFFFFF', 
                          fontSize: '14px',
                          fontWeight: '500',
                          borderRight: '1px solid #3A4553',
                          borderBottom: '1px solid #3A4553'
                        }}>{customer.address || 'N/A'}</td>
                        <td style={{ 
                          padding: '25px 15px', 
                          color: '#FFFFFF', 
                          fontSize: '14px',
                          fontWeight: '500',
                          borderRight: '1px solid #3A4553',
                          borderBottom: '1px solid #3A4553'
                        }}>{customer.city || 'N/A'}</td>
                        <td style={{ 
                          padding: '25px 15px', 
                          color: '#FFFFFF', 
                          fontSize: '14px',
                          fontWeight: '500',
                          borderRight: '1px solid #3A4553',
                          borderBottom: '1px solid #3A4553'
                        }}>{customer.site_name || 'N/A'}</td>
                        <td style={{ 
                          padding: '25px 15px', 
                          textAlign: 'center',
                          borderBottom: '1px solid #3A4553'
                        }}>
                          <div className="d-flex gap-2 justify-content-center">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              title="Edit"
                              onClick={() => handleEditCustomer(customer)}
                              style={{
                                backgroundColor: 'transparent',
                                borderColor: '#4A90E2',
                                color: '#4A90E2',
                                borderRadius: '6px',
                                padding: '8px 12px',
                                transition: 'all 0.3s ease',
                                border: '1px solid #4A90E2'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#4A90E2';
                                e.target.style.color = '#FFFFFF';
                                e.target.style.transform = 'scale(1.05)';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'transparent';
                                e.target.style.color = '#4A90E2';
                                e.target.style.transform = 'scale(1)';
                              }}
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </Button>
                            <Button
                              variant="outline-info"
                              size="sm"
                              title="View Tests"
                              style={{
                                backgroundColor: 'transparent',
                                borderColor: '#17A2B8',
                                color: '#17A2B8',
                                borderRadius: '6px',
                                padding: '8px 12px',
                                transition: 'all 0.3s ease',
                                border: '1px solid #17A2B8'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#17A2B8';
                                e.target.style.color = '#FFFFFF';
                                e.target.style.transform = 'scale(1.05)';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'transparent';
                                e.target.style.color = '#17A2B8';
                                e.target.style.transform = 'scale(1)';
                              }}
                            >
                              <FontAwesomeIcon icon={faFileAlt} />
                            </Button>
                            <Button
                              variant="outline-success"
                              size="sm"
                              title="New Test"
                              style={{
                                backgroundColor: 'transparent',
                                borderColor: '#28A745',
                                color: '#28A745',
                                borderRadius: '6px',
                                padding: '8px 12px',
                                transition: 'all 0.3s ease',
                                border: '1px solid #28A745'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#28A745';
                                e.target.style.color = '#FFFFFF';
                                e.target.style.transform = 'scale(1.05)';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'transparent';
                                e.target.style.color = '#28A745';
                                e.target.style.transform = 'scale(1)';
                              }}
                            >
                              <FontAwesomeIcon icon={faPlus} />
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              title="Delete"
                              onClick={() => handleDeleteCustomer(customer)}
                              style={{
                                backgroundColor: 'transparent',
                                borderColor: '#DC3545',
                                color: '#DC3545',
                                borderRadius: '6px',
                                padding: '8px 12px',
                                transition: 'all 0.3s ease',
                                border: '1px solid #DC3545'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#DC3545';
                                e.target.style.color = '#FFFFFF';
                                e.target.style.transform = 'scale(1.05)';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'transparent';
                                e.target.style.color = '#DC3545';
                                e.target.style.transform = 'scale(1)';
                              }}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
            
            {!loading && filteredCustomers.length === 0 && (
              <div className="text-center py-5">
                <FontAwesomeIcon icon={faUsers} size="3x" className="text-muted mb-3" />
                <h5 className="text-muted">No customers found</h5>
                <p className="text-muted">Try adjusting your search criteria or add a new customer</p>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Summary */}
        <Row className="mt-4">
          <Col>
            <Card className="card-vitrag">
              <Card.Body className="text-center">
                <h5 style={{ color: 'var(--vitrag-gold)' }}>
                  Total Customers: {filteredCustomers.length}
                </h5>
                <p className="text-muted mb-0">
                  Showing {filteredCustomers.length} of {customers.length} customers
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Add Customer Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
        <Modal.Header closeButton className="modal-header-vitrag">
          <Modal.Title>Add New Customer</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-content-vitrag">
          <Form>
            <Row>
              <Col md={4} className="mb-3">
                <Form.Group>
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="first_name"
                    value={customerForm.first_name}
                    onChange={handleInputChange}
                    className="form-control-vitrag"
                    placeholder="Enter first name"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4} className="mb-3">
                <Form.Group>
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="last_name"
                    value={customerForm.last_name}
                    onChange={handleInputChange}
                    className="form-control-vitrag"
                    placeholder="Enter last name"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4} className="mb-3">
                <Form.Group>
                  <Form.Label>Contact Person</Form.Label>
                  <Form.Control
                    type="text"
                    name="contact_person"
                    value={customerForm.contact_person}
                    onChange={handleInputChange}
                    className="form-control-vitrag"
                    placeholder="Enter contact person name"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Phone/Mobile</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={customerForm.phone}
                    onChange={handleInputChange}
                    className="form-control-vitrag"
                    placeholder="Enter 10-digit number"
                    maxLength="10"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={customerForm.email}
                    onChange={handleInputChange}
                    className="form-control-vitrag"
                    placeholder="Enter email address"
                  />
                </Form.Group>
              </Col>
              <Col md={12} className="mb-3">
                <Form.Group>
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="address"
                    value={customerForm.address}
                    onChange={handleInputChange}
                    className="form-control-vitrag"
                    placeholder="Enter address"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    name="city"
                    value={customerForm.city}
                    onChange={handleInputChange}
                    className="form-control-vitrag"
                    placeholder="Enter city"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Site Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="site_name"
                    value={customerForm.site_name}
                    onChange={handleInputChange}
                    className="form-control-vitrag"
                    placeholder="Enter site name"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer className="modal-footer-vitrag">
          {addError && (
            <Alert variant="danger" className="w-100 mb-3">
              {addError}
            </Alert>
          )}
          <Button variant="secondary" onClick={() => setShowAddModal(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            className="btn-vitrag-primary" 
            onClick={handleAddCustomer}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Adding...
              </>
            ) : (
              'Add Customer'
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Customer Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton className="modal-header-vitrag">
          <Modal.Title>Edit Customer</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-content-vitrag">
          <Form>
            <Row>
              <Col md={4} className="mb-3">
                <Form.Group>
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="first_name"
                    value={customerForm.first_name}
                    onChange={handleInputChange}
                    className="form-control-vitrag"
                    placeholder="Enter first name"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4} className="mb-3">
                <Form.Group>
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="last_name"
                    value={customerForm.last_name}
                    onChange={handleInputChange}
                    className="form-control-vitrag"
                    placeholder="Enter last name"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4} className="mb-3">
                <Form.Group>
                  <Form.Label>Contact Person</Form.Label>
                  <Form.Control
                    type="text"
                    name="contact_person"
                    value={customerForm.contact_person}
                    onChange={handleInputChange}
                    className="form-control-vitrag"
                    placeholder="Enter contact person name"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Phone/Mobile</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={customerForm.phone}
                    onChange={handleInputChange}
                    className="form-control-vitrag"
                    placeholder="Enter 10-digit number"
                    maxLength="10"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={customerForm.email}
                    onChange={handleInputChange}
                    className="form-control-vitrag"
                    placeholder="Enter email address"
                  />
                </Form.Group>
              </Col>
              <Col md={12} className="mb-3">
                <Form.Group>
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="address"
                    value={customerForm.address}
                    onChange={handleInputChange}
                    className="form-control-vitrag"
                    placeholder="Enter address"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    name="city"
                    value={customerForm.city}
                    onChange={handleInputChange}
                    className="form-control-vitrag"
                    placeholder="Enter city"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Site Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="site_name"
                    value={customerForm.site_name}
                    onChange={handleInputChange}
                    className="form-control-vitrag"
                    placeholder="Enter site name"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer className="modal-footer-vitrag">
          {editError && (
            <Alert variant="danger" className="w-100 mb-3">
              {editError}
            </Alert>
          )}
          <Button variant="secondary" onClick={() => setShowEditModal(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            className="btn-vitrag-primary" 
            onClick={handleUpdateCustomer}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Updating...
              </>
            ) : (
              'Update Customer'
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton className="modal-header-vitrag">
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-content-vitrag">
          <Alert variant="warning">
            <FontAwesomeIcon icon={faTrash} className="me-2" />
            Are you sure you want to delete this customer? This action cannot be undone.
          </Alert>
          {selectedCustomer && (
            <div>
              <p><strong>Customer:</strong> {selectedCustomer.name}</p>
              <p><strong>Contact Person:</strong> {selectedCustomer.contact_person}</p>
              <p><strong>Phone:</strong> {selectedCustomer.phone}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="modal-footer-vitrag">
          {deleteError && (
            <Alert variant="danger" className="w-100 mb-3">
              {deleteError}
            </Alert>
          )}
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={confirmDelete}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Deleting...
              </>
            ) : (
              'Delete Customer'
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Success Toast Notification - Centered and Enlarged */}
      <ToastContainer 
        position="top-center" 
        className="p-3" 
        style={{ 
          zIndex: 9999,
          position: 'fixed',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)'
        }}
      >
        <Toast 
          show={showSuccessToast} 
          onClose={() => setShowSuccessToast(false)} 
          delay={3000} 
          autohide
          bg="success"
          style={{
            minWidth: '400px',
            fontSize: '1.1rem',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
          }}
        >
          <Toast.Header style={{ padding: '15px 20px' }}>
            <FontAwesomeIcon icon={faCheckCircle} className="me-2" style={{ color: '#28A745', fontSize: '1.5rem' }} />
            <strong className="me-auto" style={{ fontSize: '1.2rem' }}>Success</strong>
          </Toast.Header>
          <Toast.Body className="text-white" style={{ padding: '20px', fontSize: '1.1rem' }}>
            {successMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default Customers;
