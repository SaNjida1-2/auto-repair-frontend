import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  useEffect(() => {
    const handleAuthChange = () => {
      setUser(JSON.parse(localStorage.getItem('user')));
    };

    window.addEventListener("storage", handleAuthChange);
    return () => window.removeEventListener("storage", handleAuthChange);
  }, []);

  const handleLogout = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        localStorage.removeItem(`cart_${user.email}`);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event("storage"));
    navigate("/login");
};

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">SANJIDA'S AUTO REPAIR and TIRES</Link>
      </div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/services">Services</Link></li>
        <li><Link to="/parts">Parts</Link></li>
        <li><Link to="/appointment">Appointment</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        
        <li>
          {user ? (
            <button className="logout-btn-nav" onClick={handleLogout}>
              Logout ({user.name.split(' ')[0]})
            </button>
          ) : (
            <Link to="/login" className="login-btn-nav">Login</Link>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
