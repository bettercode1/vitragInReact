import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './styles/custom.css';

// Context
import { DataProvider } from './contexts/DataContext';

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
import AACBlocksForm from './components/AACBlocksForm';
import FineAggregateForm from './components/FineAggregateForm';
import LiquidAdmixtureForm from './components/LiquidAdmixtureForm';
import BulkDensityMoistureForm from './components/BulkDensityMoistureForm';
import CementTestingForm from './components/CementTestingForm';
import CoarseAggregateForm from './components/CoarseAggregateForm';

function App() {
  return (
    <DataProvider>
      <Router>
        <div className="App">
          <BaseLayout>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/test-request" element={<TestRequestForm />} />
              <Route path="/samples" element={<Samples />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/other-services" element={<OtherServices />} />
              <Route path="/cube-testing-services" element={<CubeTestingServices />} />
              <Route path="/view-sample" element={<ViewSample />} />
              <Route path="/test-observations" element={<TestObservations />} />
              <Route path="/strength-graph" element={<StrengthGraph />} />
              <Route path="/generate-pdf/:testRequestId?" element={<GeneratePDF />} />
            </Routes>
          </BaseLayout>
        </div>
      </Router>
    </DataProvider>
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
                <Route path="/other-services" element={<OtherServices />} />
                <Route path="/other-services-dashboard" element={<OtherServicesDashboard />} />
                <Route path="/bulk-density-moisture-form" element={<BulkDensityMoistureForm />} />
                <Route path="/liquid-admixture-form" element={<LiquidAdmixtureForm />} />
                <Route path="/aac-blocks-form" element={<AACBlocksForm />} />
                <Route path="/cement-testing-form" element={<CementTestingForm />} />
                <Route path="/fine-aggregate-form" element={<FineAggregateForm />} />
                <Route path="/coarse-aggregate-form" element={<CoarseAggregateForm />} />
              </Routes>
            </BaseLayout>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
