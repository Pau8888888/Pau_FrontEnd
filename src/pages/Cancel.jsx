import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Cancel() {
  const navigate = useNavigate();

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80vh',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      padding: '20px'
    },
    icon: {
      fontSize: '5rem',
      color: '#f44336',
      marginBottom: '20px'
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '10px'
    },
    text: {
      fontSize: '1.2rem',
      color: '#666',
      marginBottom: '30px',
      maxWidth: '600px'
    },
    button: {
      backgroundColor: '#ff0000',
      color: '#fff',
      padding: '12px 30px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '1.1rem',
      fontWeight: 'bold',
      cursor: 'pointer'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.icon}>✕</div>
      <h1 style={styles.title}>Pagament Cancel·lat</h1>
      <p style={styles.text}>
        Sembla que has cancel·lat el procés de pagament. El teu carret encara està guardat per si vols tornar-ho a provar més tard.
      </p>
      <button style={styles.button} onClick={() => navigate('/cart')}>
        Tornar al Carret
      </button>
    </div>
  );
}
