import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

const AdminLogin = () => {
    const [adminId, setAdminId] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();


    const handleAdminLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('https://backend-z33s.onrender.com/api/admin-login', { 
                adminId, 
                password 
            });
            
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            
            window.dispatchEvent(new Event("storage"));

            alert("Access Granted");
            navigate("/admin-dashboard", { replace: true });
        } catch (err) {
            alert("Access Denied: " + (err.response?.data?.error || "Error"));
        }
    };

    return (
        <div className="admin-login-page">
            <div className="admin-overlay">
                <div className="admin-card">
                    <div className="admin-icon">
                        <span className="lock-icon">🔒</span>
                    </div>
                    <h2>Admin Portal</h2>
                    <p>Enter credentials to access management tools</p>
                    
                    <form onSubmit={handleAdminLogin}>
                        <div className="admin-input-group">
                            <input 
                                type="text" 
                                placeholder="Admin ID" 
                                value={adminId}
                                onChange={(e) => setAdminId(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="admin-input-group">
                            <input 
                                type="password" 
                                placeholder="Secret Key" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                            />
                        </div>
                        <button type="submit" className="admin-submit-btn">Authorize Access</button>
                    </form>
                    
                    <button onClick={() => navigate('/login')} className="back-btn">
                        ← Back to User Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
