import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Services.css';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get('https://backend-z33s.onrender.com/api/services');
        setServices(res.data);
      } catch (err) {
        console.error("Error loading services:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const filteredServices = services.filter((service) =>
    service.service_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddToCart = (item) => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
      alert("Please login first!");
      navigate('/login');
      return;
    }

    const cartKey = `cart_${user.email}`;
    const currentCart = JSON.parse(localStorage.getItem(cartKey)) || [];

    const existingIndex = currentCart.findIndex(c => c._id === item._id);

    if (existingIndex > -1) {
      currentCart[existingIndex].qty = (currentCart[existingIndex].qty || 1) + 1;
    } else {
      currentCart.push({ ...item, qty: 1 });
    }

    localStorage.setItem(cartKey, JSON.stringify(currentCart));
    alert("Added to your private cart!");
  };

  const handleNavigation = (targetPath, message) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert(message || "Please login first to continue!");
      navigate('/login');
    } else {
      navigate(targetPath);
    }
  };

  return (
    <div className="parts-page">
      <div className="container">
        <header className="parts-header">
          <h1>Our Services</h1>
          <p>Professional services for your car and bike</p>

          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search services (e.g. Engine, Brake...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        {loading ? (
          <div className="loader">Loading services...</div>
        ) : (
          <div className="parts-grid">
            {filteredServices.length > 0 ? (
              filteredServices.map((service) => (
                <div className="product-card" key={service._id}>
                  <div className="product-image">
                    <img
                      src={service.image || 'https://unsplash.com'}
                      alt={service.service_name}
                    />
                    <span className="category-tag">Genuine Service</span>
                  </div>

                  <div className="product-info">
                    <h3>{service.service_name}</h3>
                    <p className="description">{service.description}</p>

                    <div className="price-row">
                      <div className="price-details">
                        <span className="price">{service.price} BDT</span>
                        <span className="duration-info">
                          🕒 {service.duration || "1-2 Hours"}
                        </span>
                      </div>

                      <button
                        className="add-cart-btn"
                        onClick={() => handleAddToCart(service)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                No services found for "{searchTerm}"
              </div>
            )}
          </div>
        )}

        <div className="page-navigation">
          <button
            onClick={() =>
              handleNavigation('/appointment', "You must be logged in to book an appointment.")
            }
            className="nav-btn-outline"
          >
            Book an appointment
          </button>

          <button
            onClick={() =>
              handleNavigation('/cart', "Please login to view your cart.")
            }
            className="nav-btn-solid"
          >
            Go to cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Services;