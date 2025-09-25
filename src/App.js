import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
