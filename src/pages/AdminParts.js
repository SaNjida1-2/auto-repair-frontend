import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminParts.css';

const AdminParts = () => {
    const [parts, setParts] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ part_name: '', price: '', stock: '', description: '', image: '' });
    const [editId, setEditId] = useState(null);

    const API_URL = "https://backend-z33s.onrender.com/api/parts";
    const token = localStorage.getItem('token');

    const fetchParts = async () => {
        try {
            const res = await axios.get(API_URL);
            setParts(res.data);
        } catch (err) { console.log("Fetch Error:", err); }
    };

    useEffect(() => { fetchParts(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const config = { headers: { Authorization: `Bearer ${token}` } };
        try {
            if (editId) {
                await axios.put(`${API_URL}/${editId}`, formData, config);
                alert("Part Updated!");
            } else {
                await axios.post(API_URL, formData, config);
                alert("New Part Added!");
            }
            setFormData({ part_name: '', price: '', stock: '', description: '', image: '' });
            setShowForm(false);
            setEditId(null);
            fetchParts();
        } catch (err) { 
            console.error("Save Error:", err.response?.data);
            alert("Error: " + (err.response?.data?.error || "Check backend console")); 
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Remove this part from inventory?")) {
            await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            fetchParts();
        }
    };

    return (
        <div className="admin-parts-container">
            <header className="parts-header">
                <h2>Inventory: Parts</h2>
                <button className="add-part-toggle" onClick={() => {
                    setShowForm(!showForm);
                    if(showForm) setEditId(null);
                }}>
                    {showForm ? "✕ Close Form" : "+ Add New Part"}
                </button>
            </header>

            {showForm && (
                <form className="add-part-form" onSubmit={handleSubmit}>
                    <div className="form-row">
                        <input type="text" placeholder="Part Name" value={formData.part_name} onChange={(e) => setFormData({...formData, part_name: e.target.value})} required />
                        <input type="number" placeholder="Price" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
                        <input type="number" placeholder="Initial Stock" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} required />
                    </div>
                    
                    <div className="form-full-width">
                        <input type="text" placeholder="Image URL" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} />
                        <textarea 
                            placeholder="Part Description (Required)" 
                            value={formData.description} 
                            onChange={(e) => setFormData({...formData, description: e.target.value})} 
                            required 
                        />
                    </div>
                    
                    <button type="submit" className="save-btn">
                        {editId ? "Update Part" : "Save to Inventory"}
                    </button>
                </form>
            )}

            <div className="parts-table-wrapper">
                <table className="parts-table">
                    <thead>
                        <tr>
                            <th>Item Name</th>
                            <th>Price (BDT)</th>
                            <th>In Stock</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {parts.map(part => (
                            <tr key={part._id}>
                                <td className="font-bold">{part.part_name}</td>
                                <td>{part.price}</td>
                                <td>{part.stock}</td>
                                <td>
                                    <span className={part.stock > 0 ? "status-in" : "status-out"}>
                                        {part.stock > 0 ? "Available" : "Out of Stock"}
                                    </span>
                                </td>
                                <td>
                                    <button className="edit-icon" onClick={() => {setEditId(part._id); setFormData(part); setShowForm(true);}}>Edit</button>
                                    <button className="delete-icon" onClick={() => handleDelete(part._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminParts;
