import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Modal, InputGroup, Alert, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faPlus, 
  faEdit, 
  faTrash, 
  faUsers,
  faFileAlt,
  faEye
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
  const [submitError, setSubmitError] = useState(null);
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
    const matchesSearch = 
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.contact_person || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPhone = !phoneFilter || (customer.phone || '').includes(phoneFilter);
    const matchesCity = !cityFilter || (customer.city || '').toLowerCase().includes(cityFilter.toLowerCase());
    
    return matchesSearch && matchesPhone && matchesCity;
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddCustomer = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      await addCustomer(customerForm);
      // Refresh the data after adding
      await fetchCustomers();
      setShowAddModal(false);
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
    } catch (error) {
      console.error('Error adding customer:', error);
      setSubmitError('Failed to add customer. Please try again.');
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
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      await updateCustomer(selectedCustomer.id, customerForm);
      // Refresh the data after updating
      await fetchCustomers();
      setShowEditModal(false);
      setSelectedCustomer(null);
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
    } catch (error) {
      console.error('Error updating customer:', error);
      setSubmitError('Failed to update customer. Please try again.');
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
    setSubmitError(null);
    
    try {
      await deleteCustomer(selectedCustomer.id);
      // Refresh the data after deleting
      await fetchCustomers();
      setShowDeleteModal(false);
      setSelectedCustomer(null);
    } catch (error) {
      console.error('Error deleting customer:', error);
      setSubmitError('Failed to delete customer. Please try again.');
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
                Add New Customer
              </Button>
            </Col>
          </Row>
        </Container>
      </div>

      <Container>
        {/* Search Section */}
        <Card className="card-vitrag mb-4">
          <Card.Body>
            <Row className="align-items-end">
              <Col md={4} className="mb-3">
                <Form.Group>
                  <Form.Label>Customer Name</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <FontAwesomeIcon icon={faSearch} />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Search by customer name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="form-control-vitrag"
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={3} className="mb-3">
                <Form.Group>
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Search by phone..."
                    value={phoneFilter}
                    onChange={(e) => setPhoneFilter(e.target.value)}
                    className="form-control-vitrag"
                  />
                </Form.Group>
              </Col>
              <Col md={3} className="mb-3">
                <Form.Group>
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Search by city..."
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                    className="form-control-vitrag"
                  />
                </Form.Group>
              </Col>
              <Col md={2} className="mb-3">
                <Button
                  variant="outline-secondary"
                  onClick={resetFilters}
                  className="w-100"
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
        <Card className="card-vitrag">
          <Card.Body className="p-0">
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" className="mb-3" />
                <h5>Loading customers...</h5>
              </div>
            ) : (
              <div className="table-responsive">
                <Table className="table-vitrag mb-0">
                  <thead>
                    <tr>
                      <th>Sr. No.</th>
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>Contact Person</th>
                      <th>Phone</th>
                      <th>Email</th>
                      <th>Address</th>
                      <th>City</th>
                      <th>Site Name</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map((customer, index) => (
                      <tr key={customer.id}>
                        <td>{index + 1}</td>
                        <td>{customer.first_name || 'N/A'}</td>
                        <td>{customer.last_name || 'N/A'}</td>
                        <td>{customer.contact_person || 'N/A'}</td>
                        <td>{customer.phone || 'N/A'}</td>
                        <td>{customer.email || 'N/A'}</td>
                        <td>{customer.address || 'N/A'}</td>
                        <td>{customer.city || 'N/A'}</td>
                        <td>{customer.site_name || 'N/A'}</td>
                        <td>
                          <div className="d-flex gap-1">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              title="Edit"
                              onClick={() => handleEditCustomer(customer)}
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </Button>
                            <Button
                              variant="outline-info"
                              size="sm"
                              title="View Tests"
                            >
                              <FontAwesomeIcon icon={faFileAlt} />
                            </Button>
                            <Button
                              variant="outline-success"
                              size="sm"
                              title="New Test"
                            >
                              <FontAwesomeIcon icon={faPlus} />
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              title="Delete"
                              onClick={() => handleDeleteCustomer(customer)}
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
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>First Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="first_name"
                    value={customerForm.first_name}
                    onChange={handleInputChange}
                    className="form-control-vitrag"
                    placeholder="Enter first name"
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Last Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="last_name"
                    value={customerForm.last_name}
                    onChange={handleInputChange}
                    className="form-control-vitrag"
                    placeholder="Enter last name"
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Contact Person</Form.Label>
                  <Form.Control
                    type="text"
                    name="contact_person"
                    value={customerForm.contact_person}
                    onChange={handleInputChange}
                    className="form-control-vitrag"
                    placeholder="Enter contact person name"
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Phone *</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={customerForm.phone}
                    onChange={handleInputChange}
                    className="form-control-vitrag"
                    placeholder="Enter phone number"
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
                    placeholder="Enter full address"
                  />
                </Form.Group>
              </Col>
              <Col md={12} className="mb-3">
                <Form.Group>
                  <Form.Label>Site Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="site_name"
                    value={customerForm.site_name}
                    onChange={handleInputChange}
                    className="form-control-vitrag"
                    placeholder="Enter site name"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer className="modal-footer-vitrag">
          {submitError && (
            <Alert variant="danger" className="w-100 mb-3">
              {submitError}
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
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>First Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="first_name"
                    value={customerForm.first_name}
                    onChange={handleInputChange}
                    className="form-control-vitrag"
                    placeholder="Enter first name"
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Last Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="last_name"
                    value={customerForm.last_name}
                    onChange={handleInputChange}
                    className="form-control-vitrag"
                    placeholder="Enter last name"
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Contact Person</Form.Label>
                  <Form.Control
                    type="text"
                    name="contact_person"
                    value={customerForm.contact_person}
                    onChange={handleInputChange}
                    className="form-control-vitrag"
                    placeholder="Enter contact person name"
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Phone *</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={customerForm.phone}
                    onChange={handleInputChange}
                    className="form-control-vitrag"
                    placeholder="Enter phone number"
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
                    placeholder="Enter full address"
                  />
                </Form.Group>
              </Col>
              <Col md={12} className="mb-3">
                <Form.Group>
                  <Form.Label>Site Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="site_name"
                    value={customerForm.site_name}
                    onChange={handleInputChange}
                    className="form-control-vitrag"
                    placeholder="Enter site name"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer className="modal-footer-vitrag">
          {submitError && (
            <Alert variant="danger" className="w-100 mb-3">
              {submitError}
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
              <p><strong>Customer:</strong> {selectedCustomer.first_name} {selectedCustomer.last_name}</p>
              <p><strong>Contact Person:</strong> {selectedCustomer.contact_person}</p>
              <p><strong>Phone:</strong> {selectedCustomer.phone}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="modal-footer-vitrag">
          {submitError && (
            <Alert variant="danger" className="w-100 mb-3">
              {submitError}
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
    </div>
  );
};

export default Customers;
