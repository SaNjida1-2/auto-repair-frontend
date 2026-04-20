import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('https://backend-z33s.onrender.com/api/services');
        setServices(response.data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    const fetchTestimonials = async () => {
      try {
        const response = await axios.get('https://backend-z33s.onrender.com/api/testimonials');
        setTestimonials(response.data);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      }
    };

    fetchServices();
    fetchTestimonials();
  }, []);

  return (
    <div className="homepage">
      <header className="hero-section">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>Welcome to Sanjida's Auto Repair and Tires</h1>
            <p>
              We offer high quality repair service by professional mechanics. 
              You can also buy authentic car and bike parts from us.
            </p>
            <button 
              className="cta-btn" 
              onClick={() => {
                const token = localStorage.getItem('token');
                if (token) {
                    navigate('/appointment');
                } else {
                    alert("You must be logged in to book an appointment.");
                    navigate('/login');
                }
              }}
            >
              Book Appointment
            </button>

          </div>
        </div>
      </header>

      <section className="services-section">
        <div className="services-header">
          <h2 className="section-title">Our Services</h2>
          <button className="explore-link-btn" onClick={() => navigate('/services')}>
            Explore all services →
          </button>
        </div>

        <div className="services-grid">
          {services.slice(0, 3).map((service) => (
            <div className="service-card" key={service._id}>
              <div className="image-placeholder">
                <img 
                  src={service.image || "https://unsplash.com"} 
                  alt={service.service_name} 
                />
              </div>
              <h3>{service.service_name}</h3>
              <p>{service.description}</p>
              <div className="service-footer">
                <span className="price">${service.price}</span>
                <span className="duration">{service.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="testimonials-section">
        <h2 className="section-title">What Our Clients Say</h2>
        <div className="testimonials-grid">
          {testimonials.length > 0 ? (
            testimonials.slice(0, 3).map((t) => (
              <div className="testimonial-card" key={t._id}>
                <p>"{t.comment}"</p>
                <h4>- {t.name}</h4>
                <div className="stars">{"⭐".repeat(t.rating || 5)}</div>
              </div>
            ))
          ) : (
            <p>No reviews yet. Be the first to share your story!</p>
          )}
        </div>

        <div className="add-testimonial-cta" style={{ marginTop: '40px', textAlign: 'center' }}>
          <button 
            className="add-review-btn" 
            onClick={() => navigate('/add-testimonial')}
          >
            + Share Your Story
          </button>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-info">
            <h3>Sanjida's Auto Repair</h3>
            <p>123 Repair Lane, Mechanic City</p>
            <p>Email: contact@sanjida-auto.com</p>
          </div>
          <div className="footer-links">
            <p>© 2026 Sanjida's Auto Repair. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
