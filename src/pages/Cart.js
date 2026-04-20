import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem('user'));
        if (!loggedInUser) {
            navigate('/login');
            return;
        }
        setUser(loggedInUser);

        const cartKey = `cart_${loggedInUser.email}`;
        const savedCart = JSON.parse(localStorage.getItem(cartKey)) || [];
        setCartItems(savedCart);
    }, [navigate]);

    const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * (item.qty || 1)), 0);

    const saveCart = (updatedCart) => {
        const cartKey = `cart_${user.email}`;
        setCartItems(updatedCart);
        localStorage.setItem(cartKey, JSON.stringify(updatedCart));
    };

    const updateQty = (id, delta) => {
        const updatedCart = cartItems.map(item => {
            if (item._id === id && item.part_name) {
                const newQty = (item.qty || 1) + delta;
                if (newQty >= 1 && newQty <= (item.stock || 100)) {
                    return { ...item, qty: newQty };
                }
            }
            return item;
        });
        saveCart(updatedCart);
    };

    const removeItem = (id) => {
        const updatedCart = cartItems.filter(item => item._id !== id);
        saveCart(updatedCart);
    };

    return (
        <div className="cart-page">
            <div className="cart-container">
                <h2>{user ? `${user.name.split(' ')[0]}'s Cart` : 'Your Shopping Cart'}</h2>
                
                {cartItems.length === 0 ? (
                    <div className="empty-cart">
                        <p>Your private cart is empty.</p>
                        <button onClick={() => navigate('/parts')} className="browse-btn">Browse Parts</button>
                    </div>
                ) : (
                    <div className="cart-content">
                        <div className="cart-items-list">
                            {cartItems.map((item) => (
                                <div className="cart-item" key={item._id}>
                                    <div className="item-main">
                                        <h4>{item.part_name || item.service_name}</h4>
                                        <p className="unit-price">Price: {item.price} BDT</p>
                                    </div>

                                    <div className="cart-qty-controls">
                                        {item.part_name ? (
                                            <>
                                                <button onClick={() => updateQty(item._id, -1)}>-</button>
                                                <span>{item.qty || 1}</span>
                                                <button onClick={() => updateQty(item._id, 1)}>+</button>
                                            </>
                                        ) : (
                                            <span className="service-qty-fixed">1 (Service)</span>
                                        )}
                                    </div>

                                    <div className="item-subtotal">
                                        <p>Subtotal</p>
                                        <strong>{(item.price * (item.qty || 1))} BDT</strong>
                                    </div>

                                    <button className="remove-btn" onClick={() => removeItem(item._id)}>✕</button>
                                </div>
                            ))}
                        </div>

                        <div className="cart-summary">
                            <div className="total-row">
                                <span>Total Amount:</span>
                                <span className="total-price">{totalPrice} BDT</span>
                            </div>
                            <button 
                                className="proceed-btn" 
                                onClick={() => navigate('/appointment')}
                            >
                                Proceed to Appointment →
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
