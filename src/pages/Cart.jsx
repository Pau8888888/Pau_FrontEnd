import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  const updateQuantity = (cartId, delta) => {
    const updatedCart = cartItems.map(item => {
      if (item.cartId === cartId) {
        const newQty = Math.max(1, (item.qty || 1) + delta);
        return { ...item, qty: newQty };
      }
      return item;
    });
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeItem = (cartId) => {
    const updatedCart = cartItems.filter(item => item.cartId !== cartId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('El carret està buit');
      return;
    }
    navigate('/checkout');
  };

  const styles = {
    container: {
      maxWidth: '800px',
      margin: '40px auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    },
    title: {
      fontSize: '2rem',
      fontWeight: 'bold',
      marginBottom: '20px',
      borderBottom: '2px solid #eee',
      paddingBottom: '10px'
    },
    item: {
      display: 'flex',
      alignItems: 'center',
      padding: '15px 0',
      borderBottom: '1px solid #eee'
    },
    image: {
      width: '80px',
      height: '80px',
      objectFit: 'cover',
      borderRadius: '8px',
      marginRight: '20px'
    },
    details: {
      flex: 1
    },
    itemName: {
      fontSize: '1.2rem',
      fontWeight: '600',
      margin: 0
    },
    itemPrice: {
      color: '#666',
      marginTop: '5px'
    },
    controls: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    qtyBtn: {
      width: '30px',
      height: '30px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px solid #ddd',
      background: '#fff',
      cursor: 'pointer',
      borderRadius: '4px'
    },
    removeBtn: {
      marginLeft: '20px',
      color: '#ff4444',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: '0.9rem'
    },
    summary: {
      marginTop: '30px',
      padding: '20px',
      background: '#f9f9f9',
      borderRadius: '8px',
      textAlign: 'right'
    },
    total: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      marginBottom: '20px'
    },
    checkoutBtn: {
      backgroundColor: '#ff0000',
      color: '#fff',
      padding: '12px 30px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '1.1rem',
      fontWeight: 'bold',
      cursor: 'pointer'
    },
    empty: {
      textAlign: 'center',
      padding: '50px',
      color: '#888'
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>El teu Carret</h1>
      
      {cartItems.length === 0 ? (
        <div style={styles.empty}>
          <p>El carret està buit.</p>
          <button style={{...styles.checkoutBtn, backgroundColor: '#eee', color: '#333'}} onClick={() => navigate('/dashboard')}>
            Tornar a la botiga
          </button>
        </div>
      ) : (
        <>
          {cartItems.map(item => (
            <div key={item.cartId} style={styles.item}>
              <img src={item.image} alt={item.name} style={styles.image} />
              <div style={styles.details}>
                <h3 style={styles.itemName}>{item.name}</h3>
                <p style={styles.itemPrice}>{item.price} €</p>
                <p style={{fontSize: '0.8rem', color: '#999'}}>Talla: {item.size}</p>
              </div>
              <div style={styles.controls}>
                <button style={styles.qtyBtn} onClick={() => updateQuantity(item.cartId, -1)}>-</button>
                <span>{item.qty || 1}</span>
                <button style={styles.qtyBtn} onClick={() => updateQuantity(item.cartId, 1)}>+</button>
              </div>
              <button style={styles.removeBtn} onClick={() => removeItem(item.cartId)}>Eliminar</button>
            </div>
          ))}
          
          <div style={styles.summary}>
            <div style={styles.total}>Total: {subtotal.toFixed(2)} €</div>
            <button style={styles.checkoutBtn} onClick={handleCheckout}>Anar al Checkout</button>
          </div>
        </>
      )}
    </div>
  );
}
