
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './views/Dashboard';
import CustomerList from './views/CustomerList';
import OrdersList from './views/OrdersList';
import VisitsList from './views/VisitsList';
import NegotiationsList from './views/NegotiationsList';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/customers" element={<CustomerList />} />
          <Route path="/orders" element={<OrdersList />} />
          <Route path="/visits" element={<VisitsList />} />
          <Route path="/negotiations" element={<NegotiationsList />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
