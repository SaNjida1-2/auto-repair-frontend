import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Appointment.css';

const Appointment = () => {
    const [formData, setFormData] = useState({ 
    name: '', 
    email: '',
    phone: '', 
    address: '', 
    date: '' 
});
    const [allServices, setAllServices] = useState([]);
    const [allParts, setAllParts] = useState([]); 
    const [selectedServices, setSelectedServices] = useState([]);
    const [selectedParts, setSelectedParts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const servRes = await axios.get('https://backend-z33s.onrender.com/api/services');
                const partRes = await axios.get('https://backend-z33s.onrender.com/api/parts');
                setAllServices(servRes.data);
                setAllParts(partRes.data);
            } catch (err) {
                console.error("Fetch error:", err);
            }
        };

        const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartServices = savedCart.filter(item => item.service_name && !item.part_name);
        const cartParts = savedCart.filter(item => item.part_name || !item.service_name);
        
        setSelectedServices(cartServices);
        setSelectedParts(cartParts);
        
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const appointmentData = {
            ...formData,
            services: selectedServices.map(s => s._id),
            parts: selectedParts.map(p => ({
                _id: p._id,
                qty: p.qty || 1,
                part_name: p.part_name
            }))
        };

        try {
            await axios.post('https://backend-z33s.onrender.com/api/appointments', appointmentData);
            alert("Appointment Booked Successfully! Please wait for confirmation.");
            
            localStorage.removeItem('cart');
            window.dispatchEvent(new Event("storage"));
            
            window.location.href = "/";
        } catch (err) {
            console.error("Booking Error:", err.response?.data);
            alert("Booking Failed: " + (err.response?.data?.error || "Check connection"));
        }
    };


    const toggleSelection = (item, list, setList) => {
        if (!list.find(i => i._id === item._id)) {
            setList([...list, item]);
        }
    };

    const removeItem = (id, list, setList) => {
        const updatedList = list.filter(item => item._id !== id);
        setList(updatedList);
        
        const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
        const updatedCart = currentCart.filter(item => item._id !== id);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    return (
        <div className="appointment-container">
            <div className="appointment-overlay">
                <div className="appointment-glass-card">
                    <header className="form-header">
                        <h2>Appointment Form</h2>
                        <p>Fill in the details to schedule your service</p>
                    </header>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input type="text" placeholder="Full Name" required onChange={(e) => setFormData({...formData, name: e.target.value})} />
                             <input type="email" placeholder="Email Address (for confirmation)" required onChange={(e) => setFormData({...formData, email: e.target.value})}/>
                            <input type="text" placeholder="Phone Number" required onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                            <textarea placeholder="Service Address" required onChange={(e) => setFormData({...formData, address: e.target.value})}></textarea>
                        </div>

                        <div className="selection-group">
                            <label>Add Services</label>
                            <select onChange={(e) => e.target.value && toggleSelection(JSON.parse(e.target.value), selectedServices, setSelectedServices)}>
                                <option value="">-- Choose Services --</option>
                                {allServices.map(s => (

                                    <option key={s._id} value={JSON.stringify(s)}>{s.service_name}</option>
                                ))}
                            </select>
                            <div className="chip-box">
                                {selectedServices.map(s => (
                                    <span key={s._id} className="red-chip">
                                        {s.service_name} 
                                        <button type="button" onClick={() => removeItem(s._id, selectedServices, setSelectedServices)} className="chip-minus">-</button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="selection-group">
                            <label>Add Parts</label>
                            <select onChange={(e) => e.target.value && toggleSelection(JSON.parse(e.target.value), selectedParts, setSelectedParts)}>
                                <option value="">-- Choose Parts --</option>
                                {allParts.map(p => (
                            
                                    <option key={p._id} value={JSON.stringify(p)}>{p.part_name || p.service_name}</option>
                                ))}
                            </select>
                            <div className="chip-box">
                                {selectedParts.map(p => (
                                    <span key={p._id} className="red-chip">
                                        {p.part_name || p.service_name} 
                                        <button type="button" onClick={() => removeItem(p._id, selectedParts, setSelectedParts)} className="chip-minus">-</button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="date-group">
                            <label>Preferred Date</label>
                            <input type="date" required onChange={(e) => setFormData({...formData, date: e.target.value})} />
                        </div>

                        <button type="submit" className="booking-submit-btn">Confirm Appointment</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Appointment;
