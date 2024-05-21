// App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import StockList from './components/StockList'; // Import the new component
import { UserProvider, useUserContext } from './utils/UserContext';

const App: React.FC = () => {
  return (
    <Router>
      <UserProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/stocks" element={<PrivateRoute><StockList /></PrivateRoute>} /> {/* Add the new route */}
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </UserProvider>
    </Router>
  );
};

const PrivateRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user } = useUserContext();
  return user ? children : <Navigate to="/login" />;
};

export default App;
