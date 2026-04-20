import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AddTestimonial.css';

const AddTestimonial = () => {
    const [name, setName] = useState('');
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://backend-z33s.onrender.com/api/testimonials', {
                name,
                rating: Number(rating),
                comment
            });
            alert("Thank you! Your review has been added.");
            navigate('/');
        } catch (err) {
            alert("Error submitting review. Please try again.");
        }
    };

    return (
        <div className="add-testimonial-page">
            <div className="testimonial-overlay">
                <div className="testimonial-glass-card">
                    <header className="form-header">
                        <h2>Add Your Review</h2>
                        <p>We value your feedback!</p>
                    </header>

                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label>Name</label>
                            <input 
                                type="text" 
                                placeholder="Enter your name" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                required 
                            />
                        </div>

                        <div className="input-group">
                            <label>Rating (1-5 Stars)</label>
                            <select value={rating} onChange={(e) => setRating(e.target.value)}>
                                <option value="5">⭐⭐⭐⭐⭐ (Excellent)</option>
                                <option value="4">⭐⭐⭐⭐ (Good)</option>
                                <option value="3">⭐⭐⭐ (Average)</option>
                                <option value="2">⭐⭐ (Poor)</option>
                                <option value="1">⭐ (Terrible)</option>
                            </select>
                        </div>

                        <div className="input-group">
                            <label>Comment</label>
                            <textarea 
                                placeholder="Share your experience with us..." 
                                rows="4" 
                                value={comment} 
                                onChange={(e) => setComment(e.target.value)} 
                                required 
                            ></textarea>
                        </div>

                        <button type="submit" className="submit-review-btn">
                            Submit Review
                        </button>
                    </form>
                    <button className="back-home-link" onClick={() => navigate('/')}>
                        ← Cancel and Go Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddTestimonial;
