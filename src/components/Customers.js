import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Modal, InputGroup, Alert } from 'react-bootstrap';
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

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [phoneFilter, setPhoneFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerForm, setCustomerForm] = useState({
    customerName: '',
    contactPerson: '',
    phone: '',
    email: '',
    city: '',
    siteName: ''
  });

  // Mock data
  const customersData = [
    {
      id: 1,
      customerName: 'ABC Construction',
      contactPerson: 'John Doe',
      phone: '9876543210',
      email: 'john@abcconstruction.com',
      city: 'Mumbai',
      siteName: 'Mumbai Project Site'
    },
    {
      id: 2,
      customerName: 'XYZ Builders',
      contactPerson: 'Jane Smith',
      phone: '9876543211',
      email: 'jane@xyzbuilders.com',
      city: 'Pune',
      siteName: 'Pune Development'
    },
    {
      id: 3,
      customerName: 'DEF Engineers',
      contactPerson: 'Mike Johnson',
      phone: '9876543212',
      email: 'mike@defengineers.com',
      city: 'Delhi',
      siteName: 'Delhi Complex'
    },
    {
      id: 4,
      customerName: 'GHI Contractors',
      contactPerson: 'Sarah Wilson',
      phone: '9876543213',
      email: 'sarah@ghicontractors.com',
      city: 'Bangalore',
      siteName: 'Bangalore Site'
    },
    {
      id: 5,
      customerName: 'JKL Developers',
      contactPerson: 'David Brown',
      phone: '9876543214',
      email: 'david@jkldevelopers.com',
      city: 'Chennai',
      siteName: 'Chennai Project'
    }
  ];

  const filteredCustomers = customersData.filter(customer => {
    const matchesSearch = 
      customer.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPhone = !phoneFilter || customer.phone.includes(phoneFilter);
    const matchesCity = !cityFilter || customer.city.toLowerCase().includes(cityFilter.toLowerCase());
    
    return matchesSearch && matchesPhone && matchesCity;
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddCustomer = () => {
    // Handle add customer logic
    console.log('Adding customer:', customerForm);
    setShowAddModal(false);
    setCustomerForm({
      customerName: '',
      contactPerson: '',
      phone: '',
      email: '',
      city: '',
      siteName: ''
    });
  };

  const handleEditCustomer = (customer) => {
    setSelectedCustomer(customer);
    setCustomerForm(customer);
    setShowEditModal(true);
  };

  const handleUpdateCustomer = () => {
    // Handle update customer logic
    console.log('Updating customer:', customerForm);
    setShowEditModal(false);
    setSelectedCustomer(null);
  };

  const handleDeleteCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    // Handle delete customer logic
    console.log('Deleting customer:', selectedCustomer);
    setShowDeleteModal(false);
    setSelectedCustomer(null);
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
                Add New User
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

        {/* Customers Table */}
        <Card className="card-vitrag">
          <Card.Body className="p-0">
            <div className="table-responsive">
              <Table className="table-vitrag mb-0">
                <thead>
                  <tr>
                    <th>Sr. No.</th>
                    <th>Customer Name</th>
                    <th>Contact Person</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>City</th>
                    <th>Site Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer, index) => (
                    <tr key={customer.id}>
                      <td>{index + 1}</td>
                      <td>{customer.customerName}</td>
                      <td>{customer.contactPerson}</td>
                      <td>{customer.phone}</td>
                      <td>{customer.email}</td>
                      <td>{customer.city}</td>
                      <td>{customer.siteName}</td>
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
            
            {filteredCustomers.length === 0 && (
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
                  Showing {filteredCustomers.length} of {customersData.length} customers
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
                  <Form.Label>Customer Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="customerName"
                    value={customerForm.customerName}
                    onChange={handleInputChange}
                    className="form-control-vitrag"
                    placeholder="Enter customer name"
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Contact Person *</Form.Label>
                  <Form.Control
                    type="text"
                    name="contactPerson"
                    value={customerForm.contactPerson}
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
                  <Form.Label>City *</Form.Label>
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
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Site Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="siteName"
                    value={customerForm.siteName}
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
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" className="btn-vitrag-primary" onClick={handleAddCustomer}>
            Add Customer
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
                  <Form.Label>Customer Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="customerName"
                    value={customerForm.customerName}
                    onChange={handleInputChange}
                    className="form-control-vitrag"
                    placeholder="Enter customer name"
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Contact Person *</Form.Label>
                  <Form.Control
                    type="text"
                    name="contactPerson"
                    value={customerForm.contactPerson}
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
                  <Form.Label>City *</Form.Label>
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
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Site Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="siteName"
                    value={customerForm.siteName}
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
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" className="btn-vitrag-primary" onClick={handleUpdateCustomer}>
            Update Customer
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
              <p><strong>Customer:</strong> {selectedCustomer.customerName}</p>
              <p><strong>Contact Person:</strong> {selectedCustomer.contactPerson}</p>
              <p><strong>Phone:</strong> {selectedCustomer.phone}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="modal-footer-vitrag">
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete Customer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Customers;
