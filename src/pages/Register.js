import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://backend-z33s.onrender.com/api/register', formData);
            alert("Registration Successful! Now please login.");
            navigate('/login');
        } catch (err) {
            alert("Registration failed: " + (err.response?.data?.error || "Check your backend"));
        }
    };

    return (
        <div className="register-container">
            <div className="register-overlay">
                <div className="register-glass-card">
                    <header className="register-header">
                        <h2>Create Account</h2>
                        <p>Join Sanjida's Auto Repair community</p>
                    </header>
                    
                    <form onSubmit={handleRegister}>
                        <div className="input-group">
                            <input 
                                type="text" 
                                placeholder="Full Name" 
                                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                                required 
                            />
                        </div>
                        <div className="input-group">
                            <input 
                                type="email" 
                                placeholder="Email Address" 
                                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                                required 
                            />
                        </div>
                        <div className="input-group">
                            <input 
                                type="password" 
                                placeholder="Password" 
                                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                                required 
                            />
                        </div>
                        <button type="submit" className="register-btn">Register Now</button>
                    </form>
                    
                    <p className="login-footer">
                        Already have an account? <span onClick={() => navigate('/login')}>Login here</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
