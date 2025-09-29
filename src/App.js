import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './styles/custom.css';

// Context
import { DataProvider } from './contexts/DataContext';

// API
import { getCustomers } from './apis/customers';

// Components
import BaseLayout from './components/BaseLayout';
import SignIn from './components/SignIn';
import Homepage from './components/Homepage';
import Dashboard from './components/Dashboard';
import TestRequestForm from './components/TestRequestForm';
import Samples from './components/Samples';
import Customers from './components/Customers';
import OtherServices from './components/OtherServices';
import GeneratePDF from './components/GeneratePDF';
import CubeTestingServices from './components/CubeTestingServices';
import ViewSample from './components/ViewSample';
import TestObservations from './components/TestObservations';
import StrengthGraph from './components/StrengthGraph';
import OtherServicesDashboard from './components/OtherServicesDashboard';
import TestRecords from './components/TestRecords';
import TestReportPreview from './components/TestReportPreview';
import PDFView from './components/PDFView';
import AACBlocksForm from './components/otherServices/AACBlock/AACBlocksForm';
import FineAggregateForm from './components/otherServices/FineAggregate/FineAggregateForm';
import LiquidAdmixtureForm from './components/otherServices/LiquidAdmixture/LiquidAdmixtureForm';
import BulkDensityMoistureForm from './components/otherServices/BulkDensity/BulkDensityMoistureForm';
import CementTestingForm from './components/otherServices/CementTesting/CementTestingForm';
import SoilTestingForm from './components/otherServices/SoilTesting/SoilTestingForm';
import CoarseAggregateForm from './components/otherServices/CoarseAggregate/CoarseAggregateForm';

// Component to handle ViewSample with proper key
const ViewSampleWithKey = () => {
  const location = useLocation();
  return <ViewSample key={location.pathname + location.search} />;
};

// Component to display customers list
const CustomersList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const data = await getCustomers();
        setCustomers(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch customers');
        console.error('Error fetching customers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Customers List</h2>
      {customers.length === 0 ? (
        <div className="alert alert-info" role="alert">
          No customers found.
        </div>
      ) : (
        <div className="row">
          {customers.map((customer) => (
            <div key={customer.id} className="col-md-6 col-lg-4 mb-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">
                    {customer.first_name} {customer.last_name}
                  </h5>
                  <p className="card-text">
                    <strong>Phone:</strong> {customer.phone || 'N/A'}<br />
                    <strong>Email:</strong> {customer.email || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <DataProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Sign In Route - No BaseLayout */}
            <Route path="/signin" element={<SignIn />} />
            
            {/* All other routes with BaseLayout */}
            <Route path="/*" element={
              <BaseLayout>
                <Routes>
                  <Route path="/" element={<Homepage />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/test-request" element={<TestRequestForm />} />
                  <Route path="/samples" element={<Samples />} />
                  <Route path="/customers" element={<Customers />} />
                  <Route path="/customers-list" element={<CustomersList />} />
                  <Route path="/other-services" element={<OtherServices />} />
                  <Route path="/other-services-dashboard" element={<OtherServicesDashboard />} />
                  <Route path="/test-records" element={<TestRecords />} />
                  <Route path="/cube-testing-services" element={<CubeTestingServices />} />
                  <Route path="/view-sample" element={<ViewSampleWithKey />} />
                  <Route path="/test-observations" element={<TestObservations />} />
                  <Route path="/strength-graph" element={<StrengthGraph />} />
                  <Route path="/test-report-preview" element={<TestReportPreview />} />
                  <Route path="/pdf-view" element={<PDFView />} />
                  <Route path="/generate-pdf/:testRequestId?" element={<GeneratePDF />} />
                  <Route path="/bulk-density-moisture-form" element={<BulkDensityMoistureForm />} />
                  <Route path="/liquid-admixture-form" element={<LiquidAdmixtureForm />} />
                  <Route path="/aac-blocks-form" element={<AACBlocksForm />} />
                  <Route path="/cement-testing-form" element={<CementTestingForm />} />
                  <Route path="/soil-testing-form" element={<SoilTestingForm />} />
                  <Route path="/fine-aggregate-form" element={<FineAggregateForm />} />
                  <Route path="/coarse-aggregate-form" element={<CoarseAggregateForm />} />
                </Routes>
              </BaseLayout>
            } />
          </Routes>
        </div>
      </Router>
    </DataProvider>
  );
}

export default App;
