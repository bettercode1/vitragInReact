from datetime import datetime
from sqlalchemy import UniqueConstraint
from database import db
from werkzeug.security import generate_password_hash, check_password_hash

class Customer(db.Model):
    """Model for customer information"""
    __tablename__ = 'customer'
    
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    name = db.Column(db.String(100), nullable=False)  # Keeping for compatibility with existing code
    contact_person = db.Column(db.String(100))
    phone = db.Column(db.String(20), unique=True)  # Unique key to avoid duplication
    email = db.Column(db.String(100))
    address = db.Column(db.String(200))
    city = db.Column(db.String(100))
    site_name = db.Column(db.String(200))
    
    # One customer can have many sample test requests
    test_requests = db.relationship('TestRequest', backref='customer', lazy=True)
    
    def get_full_name(self):
        """Return the full name of the customer (first name + last name)"""
        return f"{self.first_name} {self.last_name}".strip()
    
    def __repr__(self):
        return f'<Customer {self.get_full_name()}>'

class TestRequest(db.Model):
    """Model for the test request form"""
    __tablename__ = 'test_request'
    
    id = db.Column(db.Integer, primary_key=True)
    job_number = db.Column(db.String(50), unique=True)
    test_type = db.Column(db.String(10), default='CC')  # CC, MT, NDT
    customer_id = db.Column(db.Integer, db.ForeignKey('customer.id'), nullable=False)
    site_name = db.Column(db.String(200))
    ulr_number = db.Column(db.String(50), unique=True)
    receipt_date = db.Column(db.Date, default=datetime.utcnow)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(30), default='pending')  # pending, observations_completed, graph_generated, test_completed, completed
    completion_date = db.Column(db.Date)
    disposal_date = db.Column(db.Date)
    report_filename = db.Column(db.String(255))  # Filename of the generated PDF report
    
    # Building Materials columns (boolean flags)
    river_sand = db.Column(db.Boolean, default=False)
    crushed_sand = db.Column(db.Boolean, default=False)
    m_sand = db.Column(db.Boolean, default=False)
    p_sand = db.Column(db.Boolean, default=False)
    ten_mm = db.Column(db.Boolean, default=False)
    twenty_mm = db.Column(db.Boolean, default=False)
    fly_ash = db.Column(db.Boolean, default=False)
    ggbs = db.Column(db.Boolean, default=False)
    cement = db.Column(db.Boolean, default=False)
    admixture = db.Column(db.Boolean, default=False)
    curing = db.Column(db.Boolean, default=False)
    
    # One test request can have many testing materials
    materials = db.relationship('TestingMaterial', backref='test_request', lazy=True)
    
    # One test request can have many concrete cube/core tests
    concrete_tests = db.relationship('ConcreteTest', backref='test_request', lazy=True)
    
    # Photo functionality has been removed
    
    # Fields for office use
    sample_code_number = db.Column(db.String(50))
    probable_completion_date = db.Column(db.Date)
    requirements_defined = db.Column(db.Boolean, default=False)
    requirements_remarks = db.Column(db.Text)
    capability_available = db.Column(db.Boolean, default=False)
    capability_remarks = db.Column(db.Text)
    sample_condition = db.Column(db.String(50))  # Ok / Sealed / Open
    sample_condition_remarks = db.Column(db.Text)
    customer_discussion = db.Column(db.Text)
    review_remarks = db.Column(db.Text)
    assigned_to = db.Column(db.String(100))
    reviewed_by = db.Column(db.String(100))
    
    # Additional testing requirement options
    method_capability_acceptable = db.Column(db.Boolean, default=False)
    testing_services_requested = db.Column(db.Boolean, default=False)
    terms_conditions_acceptable = db.Column(db.Boolean, default=False)
    statement_of_conformity = db.Column(db.Boolean, default=False)
    sample_sealed = db.Column(db.Boolean, default=False)
    sample_open = db.Column(db.Boolean, default=False)
    
    # Signature fields
    lab_representative_name = db.Column(db.String(100))
    lab_representative_signature = db.Column(db.Boolean, default=False)
    lab_representative_signature_data = db.Column(db.Text)  # To store the signature image data
    
    customer_representative_name = db.Column(db.String(100))
    customer_representative_signature = db.Column(db.Boolean, default=False)
    customer_representative_signature_data = db.Column(db.Text)  # To store the signature image data
    
    quality_manager_name = db.Column(db.String(100))
    quality_manager_signature = db.Column(db.Boolean, default=False)
    quality_manager_signature_data = db.Column(db.Text)  # To store the signature image data
    
    def __repr__(self):
        return f'<TestRequest {self.job_number}>'

class TestingMaterial(db.Model):
    """Model for other materials being tested"""
    __tablename__ = 'testing_material'
    
    id = db.Column(db.Integer, primary_key=True)
    test_request_id = db.Column(db.Integer, db.ForeignKey('test_request.id'), nullable=False)
    sr_no = db.Column(db.Float)  # Changed from Integer to Float to support decimal values
    material_name = db.Column(db.String(100), nullable=False)
    quantity = db.Column(db.String(50))
    test_requirement = db.Column(db.Text)
    test_method = db.Column(db.String(100))
    ulr_number = db.Column(db.String(50))
    sample_code_number = db.Column(db.String(50))
    job_number = db.Column(db.String(100))  # Unique job number for this test
    
    def __repr__(self):
        return f'<TestingMaterial {self.material_name}>'

class ConcreteTest(db.Model):
    """Model for concrete cube/core testing"""
    __tablename__ = 'concrete_test'
    
    id = db.Column(db.Integer, primary_key=True)
    test_request_id = db.Column(db.Integer, db.ForeignKey('test_request.id'), nullable=False)
    sr_no = db.Column(db.Float)  # Changed from Integer to Float to support decimal values
    id_mark = db.Column(db.String(100))
    location_nature = db.Column(db.Text)  # Location/Nature/Work
    grade = db.Column(db.String(50))
    casting_date = db.Column(db.Date)
    testing_date = db.Column(db.Date)
    age_in_days = db.Column(db.Float)  # Changed from Integer to Float to support decimal values
    num_of_cubes = db.Column(db.Float)  # Changed from Integer to Float to support decimal values
    test_method = db.Column(db.String(100))  # Test Method/Specification
    ulr_number = db.Column(db.String(100))
    sample_code_number = db.Column(db.String(50))
    job_number = db.Column(db.String(100))  # Unique job number for this test
    
    # Additional fields from the new observation form
    sample_description = db.Column(db.String(200))
    cube_condition = db.Column(db.String(100))
    curing_condition = db.Column(db.String(100))
    machine_used = db.Column(db.String(100))
    
    # Test result fields
    weight = db.Column(db.Float)  # Cube Weight in kg
    dimension_length = db.Column(db.Float)  # Length in mm
    dimension_width = db.Column(db.Float)  # Width in mm
    dimension_height = db.Column(db.Float)  # Height in mm
    crushing_load = db.Column(db.Float)  # Maximum Load in kN
    compressive_strength = db.Column(db.Float)  # Compressive Strength in MPa (N/mm²)
    average_strength = db.Column(db.Float)  # Average strength for the group in MPa
    failure_type = db.Column(db.String(20))  # Satisfy or Dis-Satisfy
    test_remarks = db.Column(db.Text)  # Remarks about test results
    test_results_json = db.Column(db.Text)  # JSON-serialized test results data
    has_results = db.Column(db.Boolean, default=False)  # Whether results have been entered
    observations_completed = db.Column(db.Boolean, default=False)  # Whether observations & photos are completed
    report_filename = db.Column(db.String(255))  # Individual test report filename
    observations_json = db.Column(db.Text)  # JSON-serialized observation selections from graph page
    
    # Test verification fields
    tested_by = db.Column(db.String(100))  # Person who conducted the test
    checked_by = db.Column(db.String(100))  # Person who checked the test
    verified_by = db.Column(db.String(100))  # Person who verified the test
    
    # Photo functionality has been removed
    
    def __repr__(self):
        return f'<ConcreteTest {self.id}>'


class TestPhoto(db.Model):
    """Model for storing test photos of concrete cube specimens"""
    __tablename__ = 'test_photo'
    
    id = db.Column(db.Integer, primary_key=True)
    concrete_test_id = db.Column(db.Integer, db.ForeignKey('concrete_test.id', ondelete='CASCADE'), nullable=False)
    photo_type = db.Column(db.String(50), nullable=False)  # front_failure, digital_reading, back_failure
    cube_number = db.Column(db.Float, nullable=False)  # Changed from Integer to Float to support decimal values
    photo_data = db.Column(db.Text)  # Base64 encoded image data
    filename = db.Column(db.String(255))  # Original filename if uploaded
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship to ConcreteTest
    concrete_test = db.relationship('ConcreteTest', backref=db.backref('photos', lazy=True, cascade='all, delete-orphan'))
    
    def __repr__(self):
        return f'<TestPhoto {self.photo_type} for Cube {self.cube_number}>'

class SequenceCounter(db.Model):
    """Model to track sequence numbers for job numbers by month and year"""
    __tablename__ = 'sequence_counter'
    
    id = db.Column(db.Integer, primary_key=True)
    test_type = db.Column(db.String(10), nullable=False)  # CC, MT, NDT
    year = db.Column(db.Integer, nullable=False)
    month = db.Column(db.Integer, nullable=False)  # 1-12
    current_sequence = db.Column(db.Integer, default=0)
    
    # Ensure we have only one record per test_type, year, month combination
    __table_args__ = (UniqueConstraint('test_type', 'year', 'month', name='_test_type_year_month_uc'),)
    
    def __repr__(self):
        return f'<SequenceCounter {self.test_type}-{self.year}-{self.month}: {self.current_sequence}>'

class Machine(db.Model):
    """Model for machine calibration management"""
    __tablename__ = 'machine'
    
    id = db.Column(db.Integer, primary_key=True)
    machine_name = db.Column(db.String(100), nullable=False)
    machine_id = db.Column(db.String(50), unique=True, nullable=False)
    last_maintenance_date = db.Column(db.Date, nullable=False)
    next_due_date = db.Column(db.Date, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def days_until_due(self):
        """Calculate days until next maintenance is due"""
        from datetime import date
        today = date.today()
        return (self.next_due_date - today).days
    
    def get_status(self):
        """Get color-coded status based on maintenance schedule"""
        days_until = self.days_until_due()
        if days_until < 0:
            return 'overdue'  # Red
        elif days_until <= 7:
            return 'due_soon'  # Yellow
        else:
            return 'current'  # Green
    
    def get_status_color(self):
        """Get Bootstrap color class for status"""
        status = self.get_status()
        if status == 'overdue':
            return 'danger'
        elif status == 'due_soon':
            return 'warning'
        else:
            return 'success'
    
    def get_status_text(self):
        """Get human-readable status text"""
        status = self.get_status()
        days_until = self.days_until_due()
        
        if status == 'overdue':
            return f'Overdue by {abs(days_until)} days'
        elif status == 'due_soon':
            return f'Due in {days_until} days'
        else:
            return f'Due in {days_until} days'
    
    def __repr__(self):
        return f'<Machine {self.machine_name} ({self.machine_id})>'

class LiquidAdmixtureTest(db.Model):
    """Model for liquid admixture relative density testing"""
    __tablename__ = 'liquid_admixture_test'
    
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customer.id'), nullable=False)
    url_number = db.Column(db.String(50))  # URL number for reference
    job_code_number = db.Column(db.String(50))  # Job code number for reference
    reference_number = db.Column(db.String(50))  # Reference number for tracking
    sample_description = db.Column(db.Text)
    date_of_receipt = db.Column(db.Date)
    test_method = db.Column(db.String(100), default='IS 9103:1999')
    sample_test_code = db.Column(db.String(50))
    date_of_testing = db.Column(db.Date)
    environmental_conditions = db.Column(db.String(200), default='Laboratory Conditions')
    tested_by_name = db.Column(db.String(100))
    tested_by_date = db.Column(db.Date)
    checked_by_name = db.Column(db.String(100))
    checked_by_date = db.Column(db.Date)
    verified_by_name = db.Column(db.String(100), default='Prakarsh A Sangave')
    verified_by_date = db.Column(db.Date)
    reviewed_by = db.Column(db.String(100))  # Reviewed by field
    authorized_by = db.Column(db.String(100), default='Prakarsh Sangave')  # Authorized by field (always Prakarsh Sangave)
    remarks = db.Column(db.Text)
    specific_gravity = db.Column(db.Float)  # Calculated average relative density
    report_filename = db.Column(db.String(255))  # Filename of the generated PDF report
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default='pending')
    
    # Relationship to customer
    customer = db.relationship('Customer', backref='liquid_admixture_tests')
    
    # Relationship to readings
    readings = db.relationship('LiquidAdmixtureReading', backref='test', lazy=True, cascade='all, delete-orphan')
    
    def get_average_relative_density(self):
        """Calculate average relative density from readings"""
        if not self.readings:
            return None
        valid_readings = [r.relative_density for r in self.readings if r.relative_density is not None]
        if valid_readings:
            return sum(valid_readings) / len(valid_readings)
        return None
    
    def __repr__(self):
        return f'<LiquidAdmixtureTest {self.id}>'

class LiquidAdmixtureReading(db.Model):
    """Model for individual readings in liquid admixture test"""
    __tablename__ = 'liquid_admixture_reading'
    
    id = db.Column(db.Integer, primary_key=True)
    test_id = db.Column(db.Integer, db.ForeignKey('liquid_admixture_test.id'), nullable=False)
    sr_no = db.Column(db.Integer)
    colour_texture = db.Column(db.String(200))
    volume_ml = db.Column(db.Float)
    temperature_c = db.Column(db.Float)
    hydrometer_reading = db.Column(db.Float)
    relative_density = db.Column(db.Float)
    
    def __repr__(self):
        return f'<LiquidAdmixtureReading {self.sr_no}>'

class Reviewer(db.Model):
    """Model for storing reviewer information"""
    __tablename__ = 'reviewer'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    designation = db.Column(db.String(100), nullable=False)
    graduation = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship to test reviews
    test_reviews = db.relationship('TestReview', backref='reviewer', lazy=True)
    
    def __repr__(self):
        return f'<Reviewer {self.name}>'

class TestReview(db.Model):
    """Model for tracking which reviewer reviewed which test"""
    __tablename__ = 'test_review'
    
    id = db.Column(db.Integer, primary_key=True)
    test_request_id = db.Column(db.Integer, db.ForeignKey('test_request.id'), nullable=False)
    reviewer_id = db.Column(db.Integer, db.ForeignKey('reviewer.id'), nullable=False)
    reviewed_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship to test request
    test_request = db.relationship('TestRequest', backref='reviews')
    
    def __repr__(self):
        return f'<TestReview {self.test_request_id} by {self.reviewer_id}>'

class BulkDensityMoistureTest(db.Model):
    """Model for bulk density and moisture content testing"""
    __tablename__ = 'bulk_density_moisture_test'
    
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customer.id'), nullable=False)
    url_number = db.Column(db.String(50))  # URL number for reference
    job_code_number = db.Column(db.String(50))  # Job code number for reference
    reference_number = db.Column(db.String(50))  # Reference number for tracking
    sample_description = db.Column(db.Text)
    date_of_receipt = db.Column(db.Date)
    test_method = db.Column(db.String(100), default='IS 2386 (Part III): 1963')
    sample_test_code = db.Column(db.String(50))
    date_of_testing = db.Column(db.Date)
    environmental_conditions = db.Column(db.String(200), default='Laboratory Conditions')
    tested_by_name = db.Column(db.String(100))
    tested_by_date = db.Column(db.Date)
    checked_by_name = db.Column(db.String(100))
    checked_by_date = db.Column(db.Date)
    verified_by_name = db.Column(db.String(100), default='Prakarsh A Sangave')
    verified_by_date = db.Column(db.Date)
    reviewed_by = db.Column(db.String(100))  # Reviewed by field
    authorized_by = db.Column(db.String(100), default='Prakarsh Sangave')  # Authorized by field
    remarks = db.Column(db.Text)
    avg_bulk_density = db.Column(db.Float)  # Average bulk density
    avg_moisture_content = db.Column(db.Float)  # Average moisture content
    report_filename = db.Column(db.String(255))  # Filename of the generated PDF report
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default='pending')
    
    # Relationship to customer
    customer = db.relationship('Customer', backref='bulk_density_moisture_tests')
    
    # Relationship to readings
    readings = db.relationship('BulkDensityMoistureReading', backref='test', lazy=True, cascade='all, delete-orphan')
    
    def get_average_bulk_density(self):
        """Calculate average bulk density from readings"""
        if not self.readings:
            return None
        valid_readings = [r.bulk_density for r in self.readings if r.bulk_density is not None]
        if valid_readings:
            return sum(valid_readings) / len(valid_readings)
        return None
    
    def get_average_moisture_content(self):
        """Calculate average moisture content from readings"""
        if not self.readings:
            return None
        valid_readings = [r.moisture_content for r in self.readings if r.moisture_content is not None]
        if valid_readings:
            return sum(valid_readings) / len(valid_readings)
        return None
    
    def __repr__(self):
        return f'<BulkDensityMoistureTest {self.id}>'

class BulkDensityMoistureReading(db.Model):
    """Model for individual readings in bulk density and moisture content test"""
    __tablename__ = 'bulk_density_moisture_reading'
    
    id = db.Column(db.Integer, primary_key=True)
    test_id = db.Column(db.Integer, db.ForeignKey('bulk_density_moisture_test.id'), nullable=False)
    sr_no = db.Column(db.Integer)
    weight_before = db.Column(db.Float)  # Weight before oven drying (kg)
    weight_after = db.Column(db.Float)   # Weight after oven drying (kg)
    length = db.Column(db.Float)         # Length (mm)
    breadth = db.Column(db.Float)        # Breadth (mm)
    depth = db.Column(db.Float)          # Depth (mm)
    volume = db.Column(db.Float)         # Volume (m³)
    bulk_density = db.Column(db.Float)   # Bulk density (kg/m³)
    moisture_content = db.Column(db.Float)  # Moisture content (%)
    
    def __repr__(self):
        return f'<BulkDensityMoistureReading {self.sr_no}>'

class AACBlockTest(db.Model):
    """Model for AAC Block compressive strength testing"""
    __tablename__ = 'aac_block_test'
    
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customer.id'), nullable=False)
    sample_test_code = db.Column(db.String(50))
    quantity_of_blocks = db.Column(db.Integer)
    date_of_casting = db.Column(db.Date)
    grade_of_blocks = db.Column(db.String(50))
    manufacture_of_blocks = db.Column(db.String(100))
    machine_used_for_testing = db.Column(db.String(100))
    customer_site_name_address = db.Column(db.Text)
    reference_number = db.Column(db.String(50))
    date_of_receipt = db.Column(db.Date)
    date_of_manufacturer = db.Column(db.Date)
    type_of_specimen = db.Column(db.String(100))
    location_of_test = db.Column(db.String(100))
    capacity_range = db.Column(db.String(100))
    test_method = db.Column(db.String(100))
    sample_description = db.Column(db.Text)
    date_of_testing = db.Column(db.Date)
    blocks_condition = db.Column(db.String(100))
    curing_condition = db.Column(db.String(100))
    date_of_report = db.Column(db.Date)
    ulr_number = db.Column(db.String(50))
    job_code_number = db.Column(db.String(50))
    manufacturer = db.Column(db.String(100))
    condition_of_specimen = db.Column(db.String(100))
    calibration_due_date = db.Column(db.Date)
    environmental_condition = db.Column(db.String(200))
    tested_by_name = db.Column(db.String(100))
    tested_by_date = db.Column(db.Date)
    checked_by_name = db.Column(db.String(100))
    checked_by_date = db.Column(db.Date)
    verified_by_name = db.Column(db.String(100))
    verified_by_date = db.Column(db.Date)
    reviewed_by = db.Column(db.String(100))
    authorized_by = db.Column(db.String(100))
    remarks = db.Column(db.Text)
    status = db.Column(db.String(20), default='pending')
    report_filename = db.Column(db.String(255))
    # Test Results - Block 1
    block_id_1 = db.Column(db.String(50))
    length_1 = db.Column(db.Float)
    breadth_1 = db.Column(db.Float)
    height_1 = db.Column(db.Float)
    area_1 = db.Column(db.Float)
    weight_1 = db.Column(db.Float)
    density_1 = db.Column(db.Float)
    load_max_1 = db.Column(db.Float)
    compressive_strength_1 = db.Column(db.Float)
    
    # Test Results - Block 2
    block_id_2 = db.Column(db.String(50))
    length_2 = db.Column(db.Float)
    breadth_2 = db.Column(db.Float)
    height_2 = db.Column(db.Float)
    area_2 = db.Column(db.Float)
    weight_2 = db.Column(db.Float)
    density_2 = db.Column(db.Float)
    load_max_2 = db.Column(db.Float)
    compressive_strength_2 = db.Column(db.Float)
    
    # Test Results - Block 3
    block_id_3 = db.Column(db.String(50))
    length_3 = db.Column(db.Float)
    breadth_3 = db.Column(db.Float)
    height_3 = db.Column(db.Float)
    area_3 = db.Column(db.Float)
    weight_3 = db.Column(db.Float)
    density_3 = db.Column(db.Float)
    load_max_3 = db.Column(db.Float)
    compressive_strength_3 = db.Column(db.Float)
    
    # Average Results
    avg_load_max = db.Column(db.Float)
    avg_compressive_strength = db.Column(db.Float)
    
    # Image fields for AAC block testing - TEMPORARILY COMMENTED OUT
    # before_testing_image = db.Column(db.String(255))  # Path to before testing image
    # after_testing_image = db.Column(db.String(255))   # Path to after testing image
    # failure_image = db.Column(db.String(255))         # Path to failure image (if any)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship to customer
    customer = db.relationship('Customer', backref='aac_block_tests')
    
    def __repr__(self):
        return f'<AACBlockTest {self.id}>'


class User(db.Model):
    """Model for user authentication - SIMPLE VERSION WITH PLAIN PASSWORD"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)  # Plain password (not secure for production!)
    full_name = db.Column(db.String(255))
    role = db.Column(db.String(50), default='user')  # 'admin', 'user', 'technician'
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    
    def __repr__(self):
        return f'<User {self.email}>'
