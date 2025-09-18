import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './styles/custom.css';

// Context
import { DataProvider } from './contexts/DataContext';

// Components
import BaseLayout from './components/BaseLayout';
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
  );
}

export default App;
