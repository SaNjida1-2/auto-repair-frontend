import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Services from './pages/Services';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Appointment from './pages/Appointment';
import Contact from './pages/Contact';
import Parts from './pages/Parts';
import AddTestimonial from './pages/AddTestimonial';
import Cart from './pages/Cart';

function App() {
  const [authState, setAuthState] = useState({
    token: localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user'))
  });

  useEffect(() => {
    const handleAuthChange = () => {
      setAuthState({
        token: localStorage.getItem('token'),
        user: JSON.parse(localStorage.getItem('user'))
      });
    };

    window.addEventListener("storage", handleAuthChange);
    
    return () => window.removeEventListener("storage", handleAuthChange);
  }, []);

  const isAdmin = authState.token && authState.user?.role === 'admin';
  const isAuthenticated = !!authState.token;

  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/parts" element={<Parts />} />
          <Route path="/add-testimonial" element={<AddTestimonial />} />
          <Route path="/cart" element={<Cart />} />
          
          <Route 
            path="/appointment" 
            element={isAuthenticated ? <Appointment /> : <Navigate to="/login" replace />} 
          />

          <Route 
            path="/admin-dashboard" 
            element={
              isAuthenticated && isAdmin 
              ? <AdminDashboard /> 
              : <Navigate to="/admin-login" replace />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
