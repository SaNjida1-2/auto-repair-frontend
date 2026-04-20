import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
const isLocal = window.location.hostname === "localhost";
const API_URL = isLocal 
    ? "http://localhost:5000/api" 
    : "https://backend-z33s.onrender.com/api";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log(API_URL);
        try {
            const res = await axios.post(`${API_URL}/login`, { email, password });
            
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            
            window.dispatchEvent(new Event("storage"));
            alert("Login Successful!");
            navigate("/"); 
        } catch (err) {
            alert("Login failed: " + (err.response?.data?.error || "Invalid credentials"));
        }
    };

    return (
        <div className="login-page">
            <div className="login-overlay">
                <div className="login-card">
                    <div className="login-header">
                        <h2>Welcome Back</h2>
                        <p>Login to manage your appointments</p>
                    </div>
                    
                    <form onSubmit={handleLogin}>
                        <div className="input-group">
                            <input 
                                type="email" 
                                placeholder="Email Address" 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="input-group">
                            <input 
                                type="password" 
                                placeholder="Password" 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                            />
                        </div>
                        <button type="submit" className="login-submit-btn">Login</button>
                    </form>

                    <div className="login-footer">
                        <p>New here? <Link to="/register">Create an account</Link></p>
                        <div className="divider"><span>OR</span></div>
                        <Link to="/admin-login" className="admin-btn">Admin Portal</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
