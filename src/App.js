import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './styles/custom.css';

// Components
import BaseLayout from './components/BaseLayout';
import Homepage from './components/Homepage';
import Dashboard from './components/Dashboard';
import TestRequestForm from './components/TestRequestForm';
import Samples from './components/Samples';
import Customers from './components/Customers';
import OtherServices from './components/OtherServices';

function App() {
  return (
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
          </Routes>
        </BaseLayout>
      </div>
    </Router>
  );
}

export default App;
