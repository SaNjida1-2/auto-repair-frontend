import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('services');
    const [services, setServices] = useState([]);
    const [parts, setParts] = useState([]);
    const [users, setUsers] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [testimonials, setTestimonials] = useState([]);
    const [messages, setMessages] = useState([]);
    
    const [serviceFormData, setServiceFormData] = useState({ service_name: '', description: '', price: '', duration: '', image: '' });
    const [partFormData, setPartFormData] = useState({ part_name: '', price: '', stock: '', description: '', image: '' });
    const [editId, setEditId] = useState(null);

    const API_URL = "https://backend-z33s.onrender.com/api";
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

        useEffect(() => {
        if (activeTab === 'services') fetchServices();
        if (activeTab === 'parts') fetchParts();
        if (activeTab === 'testimonials') fetchTestimonials();
        if (activeTab === 'appointments') fetchAppointments();
        if (activeTab === 'users') fetchUsers();
        if (activeTab === 'messages') fetchMessages();
    }, [activeTab]);

    const fetchMessages = async () => {
        try {
            const res = await axios.get(`${API_URL}/contacts`, config);
            setMessages(res.data);
        } catch (err) {
            console.error("Error fetching messages");
        }
    };

    const fetchServices = async () => {
        try {
            const res = await axios.get(`${API_URL}/services`);
            setServices(res.data);
        } catch (err) { console.error("Error fetching services"); }
    };

    const fetchParts = async () => {
        try {
            const res = await axios.get(`${API_URL}/parts`);
            setParts(res.data);
        } catch (err) { console.error("Error fetching parts"); }
    };

    const fetchAppointments = async () => {
        try {
            const res = await axios.get(`${API_URL}/appointments`);
            setAppointments(res.data);
        } catch (err) { console.error("Error fetching appointments"); }
    };

    const fetchTestimonials = async () => {
        try {
            const res = await axios.get(`${API_URL}/testimonials`);
            setTestimonials(res.data);
        } catch (err) { console.error("Error fetching testimonials"); }
    };

    const deleteTestimonial = async (id) => {
        if (window.confirm("Are you sure you want to delete this review?")) {
            try {
                await axios.delete(`${API_URL}/testimonials/${id}`, config);
                fetchTestimonials();
            } catch (err) { alert("Delete failed"); }
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${API_URL}/users`, config);
            setUsers(res.data);
        } catch (err) {
            console.error("Error fetching users");
        }
    };

    const handleServiceSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await axios.put(`${API_URL}/services/${editId}`, serviceFormData, config);
                alert("Service Updated!");
            } else {
                await axios.post(`${API_URL}/services`, serviceFormData, config);
                alert("Service Added!");
            }
            resetForms();
            fetchServices();
        } catch (err) { alert("Error: " + (err.response?.data?.error || "Invalid Token")); }
    };

    const handleAccept = async (id) => {
    try {
        await axios.put(`${API_URL}/appointments/${id}/accept`, {}, config);
        alert("Appointment Accepted! Confirmation email sent to customer.");
        fetchAppointments();
    } catch (err) {
        console.error("Accept Error:", err);
        alert("Failed to accept: " + (err.response?.data?.error || "Error"));
    }
};


    const handlePartSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await axios.put(`${API_URL}/parts/${editId}`, partFormData, config);
                alert("Part Updated!");
            } else {
                await axios.post(`${API_URL}/parts`, partFormData, config);
                alert("Part Added!");
            }
            resetForms();
            fetchParts();
        } catch (err) { alert("Error: " + (err.response?.data?.error || "Invalid Token")); }
    };

    const deleteItem = async (id, type) => {
    if (window.confirm(`Are you sure you want to clear this ${type}?`)) {
        try {
            await axios.delete(`${API_URL}/${type}/${id}`, config);
            
            if (type === 'contacts') {
                setMessages(prevMessages => prevMessages.filter(msg => msg._id !== id));
            } else if (type === 'services') {
                setServices(prev => prev.filter(item => item._id !== id));
            } else if (type === 'parts') {
                setParts(prev => prev.filter(item => item._id !== id));
            } else if (type === 'appointments') {
                setAppointments(prev => prev.filter(item => item._id !== id));
            }

            alert("Deleted successfully!");
        } catch (err) {
            console.error("Delete Error:", err);
            alert("Delete failed.");
        }
    }
};

    const resetForms = () => {
        setServiceFormData({ service_name: '', description: '', price: '', duration: '', image: '' });
        setPartFormData({ part_name: '', price: '', stock: '', description: '', image: '' });
        setEditId(null);
    };

    return (
        <div className="dashboard-wrapper">
            <aside className="dashboard-sidebar">
                <div className="sidebar-brand"><h3>Admin Panel</h3></div>
                <ul className="sidebar-nav">
                    <li className={activeTab === 'services' ? 'active' : ''} onClick={() => {setActiveTab('services'); resetForms();}}>Services</li>
                    <li className={activeTab === 'parts' ? 'active' : ''} onClick={() => {setActiveTab('parts'); resetForms();}}>Parts</li>
                    <li className={activeTab === 'appointments' ? 'active' : ''} onClick={() => setActiveTab('appointments')}>Appointments</li>
                    <li className={activeTab === 'testimonials' ? 'active' : ''} onClick={() => setActiveTab('testimonials')}>Testimonials</li>
                    <li className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>Users</li>
                    <li className={activeTab === 'messages' ? 'active' : ''} onClick={() => setActiveTab('messages')}>Messages</li>
                </ul>
            </aside>

            <main className="dashboard-content">
                
                {activeTab === 'services' && (
                    <div className="manager-section">
                        <header className="content-header"><h2>Services Manager</h2></header>
                        <form className="admin-form" onSubmit={handleServiceSubmit}>
                            <div className="form-grid">
                                <input type="text" placeholder="Service Name" value={serviceFormData.service_name} onChange={(e) => setServiceFormData({...serviceFormData, service_name: e.target.value})} required />
                                <input type="number" placeholder="Price ($)" value={serviceFormData.price} onChange={(e) => setServiceFormData({...serviceFormData, price: e.target.value})} required />
                                <input type="text" placeholder="Duration" value={serviceFormData.duration} onChange={(e) => setServiceFormData({...serviceFormData, duration: e.target.value})} required />
                                <input type="text" placeholder="Image URL (e.g. https://...)" value={serviceFormData.image} onChange={(e) => setServiceFormData({...serviceFormData, image: e.target.value})} required/>
                            </div>
                            <textarea placeholder="Service Description (Required)" value={serviceFormData.description} onChange={(e) => setServiceFormData({...serviceFormData, description: e.target.value})} required></textarea>
                            <button type="submit" className="save-btn">{editId ? "Update Service" : "Add Service"}</button>
                        </form>
                        <div className="table-card">
                            <table className="admin-table">
                                <thead><tr><th>Name</th><th>Price</th><th>Actions</th></tr></thead>
                                <tbody>
                                    {services.map(s => (
                                        <tr key={s._id}>
                                            <td>{s.service_name}</td><td>${s.price}</td>
                                            <td>
                                                <button className="edit-btn" onClick={() => {setEditId(s._id); setServiceFormData(s)}}>Edit</button>
                                                <button className="delete-btn" onClick={() => deleteItem(s._id, 'services')}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'parts' && (
                    <div className="manager-section">
                        <header className="content-header"><h2>Parts Inventory</h2></header>
                        <form className="admin-form" onSubmit={handlePartSubmit}>
                            <div className="form-grid">
                                <input type="text" placeholder="Part Name" value={partFormData.part_name} onChange={(e) => setPartFormData({...partFormData, part_name: e.target.value})} required />
                                <input type="number" placeholder="Price (BDT)" value={partFormData.price} onChange={(e) => setPartFormData({...partFormData, price: e.target.value})} required />
                                <input type="number" placeholder="Stock Qty" value={partFormData.stock} onChange={(e) => setPartFormData({...partFormData, stock: e.target.value})} required />
                                <input type="text" placeholder="Image URL (e.g. https://...)" value={partFormData.image} onChange={(e) => setPartFormData({...partFormData, image: e.target.value})} />
                            </div>
                            <textarea placeholder="Part Description (Required)" value={partFormData.description} onChange={(e) => setPartFormData({...partFormData, description: e.target.value})} required></textarea>
                            <button type="submit" className="save-btn">{editId ? "Update Part" : "Add Part"}</button>
                        </form>
                        <div className="table-card">
                            <table className="admin-table">
                                <thead><tr><th>Name</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead>
                                <tbody>
                                    {parts.map(p => (
                                        <tr key={p._id}>
                                            <td className="font-bold">{p.part_name}</td><td>{p.price} BDT</td>
                                            <td><span className={p.stock < 5 ? "status-low" : "status-in"}>{p.stock}</span></td>
                                            <td>
                                                <button className="edit-btn" onClick={() => {setEditId(p._id); setPartFormData(p)}}>Edit</button>
                                                <button className="delete-btn" onClick={() => deleteItem(p._id, 'parts')}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'appointments' && (
                    <div className="manager-section">
                        <header className="content-header">
                            <h2>Incoming Appointments</h2>
                            <p>Manage customer bookings and inventory requests</p>
                        </header>

                        <div className="table-card">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Customer</th>
                                        <th>Contact</th>
                                        <th>Booked Items</th>
                                        <th>Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {appointments.map((app) => (
                                        <tr key={app._id}>
                                            <td>
                                                <div className="font-bold">{app.name}</div>
                                                <div className="text-small">{app.address}</div>
                                            </td>
                                            <td>
                                                {app.phone} <br/>
                                                <small>{app.email}</small>
                                            </td>
                                            <td>
                                                <div className="booked-items">
                                                    {app.services?.map(s => <span key={s._id} className="item-tag service">{s.service_name}</span>)}
                                                    {app.parts?.map(p => <span key={p._id} className="item-tag part">{p.part_name}</span>)}
                                                </div>
                                            </td>
                                            <td>{app.date ? new Date(app.date).toLocaleDateString() : "No Date"}</td>
                                            <td className="actions-cell">
                                                {app.status === 'confirmed' ? (
                                                    <span className="status-badge-accepted">Accepted</span>
                                                ) : (
                                                    <button 
                                                        className="accept-btn" 
                                                        onClick={() => handleAccept(app._id)}
                                                    >
                                                        Accept
                                                    </button>
                                                )}

                                                <button 
                                                    className="delete-btn" 
                                                    onClick={() => deleteItem(app._id, 'appointments')}
                                                >
                                                    Cancel
                                                </button>
                                            </td>
                                        </tr>
                                    ))}

                                </tbody>
                            </table>
                        </div>
                    </div>
                )}


                {activeTab === 'testimonials' && (
                    <div className="manager-section">
                        <header className="content-header">
                            <h2>User Testimonials</h2>
                            <p>Manage the reviews displayed on the homepage</p>
                        </header>

                        <div className="table-card">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Comment</th>
                                        <th>Rating</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {testimonials.length > 0 ? (
                                        testimonials.map(t => (
                                            <tr key={t._id}>
                                                <td className="font-bold">{t.name}</td>
                                                <td className="comment-cell">{t.comment}</td>
                                                <td>
                                                    <span className="rating-badge">{t.rating} ⭐</span>
                                                </td>
                                                <td>
                                                    <button className="delete-btn" onClick={() => deleteTestimonial(t._id)}>Delete</button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="4" style={{textAlign:'center'}}>No testimonials found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'messages' && (
                    <div className="manager-section">
                        <header className="content-header">
                            <h2>Contact Messages</h2>
                            <p>Customer inquiries and feedback</p>
                        </header>

                        <div className="table-card">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Sender</th>
                                        <th>Message</th>
                                        <th>Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {messages.map(m => (
                                        <tr key={m._id}>
                                            <td className="font-bold">
                                                {m.name} <br/>
                                                <small>{m.email}</small>
                                            </td>
                                            <td className="comment-cell">{m.message}</td>
                                            <td>{new Date(m.date).toLocaleDateString()}</td>
                                            <td>
                                                <button className="delete-btn" onClick={() => deleteItem(m._id, 'contacts')}>
                                                    Clear
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="manager-section">
                        <header className="content-header">
                            <h2>User Management</h2>
                            <p>View and manage registered accounts</p>
                        </header>

                        <div className="table-card">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(u => (
                                        <tr key={u._id}>
                                            <td className="font-bold">{u.name}</td>
                                            <td>{u.email}</td>
                                            <td>
                                                <span className={`role-badge ${u.role}`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td>
                                                {u.role !== 'admin' && (
                                                    <button className="delete-btn" onClick={() => deleteItem(u._id, 'users')}>
                                                        Remove
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
};

export default AdminDashboard;
