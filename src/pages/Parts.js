import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Parts.css';

const Parts = () => {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [quantities, setQuantities] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchParts = async () => {
      try {
        const res = await axios.get('https://backend-z33s.onrender.com/api/parts');
        setParts(res.data);
      } catch (err) {
        console.error("Error loading parts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchParts();
  }, []);

  const handleQtyChange = (id, delta, maxStock) => {
    const currentQty = quantities[id] || 1;
    const newQty = currentQty + delta;

    if (newQty >= 1 && newQty <= maxStock) {
      setQuantities({ ...quantities, [id]: newQty });
    }
  };

  const filteredParts = parts.filter((part) =>
    part.part_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddToCart = async (item) => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
      alert("Please login first!");
      navigate('/login');
      return;
    }

    const cartKey = `cart_${user.email}`;
    const currentCart = JSON.parse(localStorage.getItem(cartKey)) || [];

    const qtyToAdd = quantities[item._id] || 1;
    const existingIndex = currentCart.findIndex(c => c._id === item._id);

    if (existingIndex > -1) {
      currentCart[existingIndex].qty += qtyToAdd;
    } else {
      currentCart.push({ ...item, qty: qtyToAdd });
    }

    localStorage.setItem(cartKey, JSON.stringify(currentCart));
    alert("Added to your private cart!");

    try {
      await axios.patch(
        `https://backend-z33s.onrender.com/api/parts/${item._id}/reduce-stock`,
        { qty: qtyToAdd }
      );

      setParts(prevParts =>
        prevParts.map(p =>
          p._id === item._id
            ? { ...p, stock: p.stock - qtyToAdd }
            : p
        )
      );

      const currentCart2 = JSON.parse(localStorage.getItem('cart')) || [];
      const existingIndex2 = currentCart2.findIndex(
        cartItem => cartItem._id === item._id
      );

      if (existingIndex2 > -1) {
        currentCart2[existingIndex2].qty += qtyToAdd;
      } else {
        currentCart2.push({ ...item, qty: qtyToAdd });
      }

      localStorage.setItem('cart', JSON.stringify(currentCart2));

      setQuantities({ ...quantities, [item._id]: 1 });

      alert(`${qtyToAdd} x ${item.part_name} added and stock updated!`);

    } catch (err) {
      console.error("Stock update failed:", err);
      alert("Failed to update stock. Try again.");
    }
  };

  const handleNavigation = (path, message) => {
    if (!localStorage.getItem('token')) {
      alert(message);
      navigate('/login');
    } else {
      navigate(path);
    }
  };

  return (
    <div className="parts-page">
      <div className="parts-container">
        <header className="parts-header">
          <h1>Vehicle Parts & Accessories</h1>

          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search parts (e.g. Tire, Battery, LED...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        {loading ? (
          <div className="loader">Loading inventory...</div>
        ) : (
          <div className="parts-grid">
            {filteredParts.length > 0 ? (
              filteredParts.map((part) => (
                <div className="product-card" key={part._id}>
                  <div className="product-image">
                    <img
                      src={part.image || 'https://via.placeholder.com/150'}
                      alt={part.part_name}
                    />
                    <span className={`badge ${part.stock <= 0 ? 'out-of-stock' : ''}`}>
                      {part.stock <= 0 ? 'Stock Out' : 'Genuine'}
                    </span>
                  </div>

                  <div className="product-info">
                    <h3>{part.part_name}</h3>
                    <p className="description">{part.description}</p>

                    <div className="price-row">
                      <div className="price-stock-info">
                        <span className="price">{part.price} BDT</span>
                        <span className={`stock-count ${part.stock < 5 ? 'low-stock' : ''}`}>
                          {part.stock > 0 ? `In Stock: ${part.stock}` : 'Unavailable'}
                        </span>
                      </div>

                      <div className="qty-controls">
                        <button
                          className="qty-btn"
                          onClick={() => handleQtyChange(part._id, -1, part.stock)}
                          disabled={part.stock <= 0}
                        >-</button>

                        <span className="qty-val">
                          {quantities[part._id] || 1}
                        </span>

                        <button
                          className="qty-btn"
                          onClick={() => handleQtyChange(part._id, 1, part.stock)}
                          disabled={
                            part.stock <= 0 ||
                            (quantities[part._id] || 1) >= part.stock
                          }
                        >+</button>
                      </div>

                      <button
                        className="add-btn"
                        onClick={() => handleAddToCart(part)}
                        disabled={part.stock <= 0}
                      >
                        {part.stock <= 0 ? 'Sold Out' : 'Add'}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                No parts found matching "{searchTerm}"
              </div>
            )}
          </div>
        )}

        <div className="parts-footer-nav">
          <button
            onClick={() => handleNavigation('/appointment', "Please login to book.")}
            className="footer-btn"
          >
            Book appointment →
          </button>

          <button
            onClick={() => handleNavigation('/cart', "Please login to view cart.")}
            className="footer-btn solid"
          >
            Go to cart →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Parts;