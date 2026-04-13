import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function Success() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Netejar el carret en cas d'èxit
    localStorage.removeItem('cart');
  }, []);

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
      color: '#4CAF50',
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
      <div style={styles.icon}>✓</div>
      <h1 style={styles.title}>Pagament Completat!</h1>
      <p style={styles.text}>
        Gràcies per la teva compra. Hem rebut correctament el teu pagament.
        {sessionId && <><br /><small style={{color: '#999'}}>ID de sessió: {sessionId}</small></>}
      </p>
      <button style={styles.button} onClick={() => navigate('/dashboard')}>
        Tornar a la Botiga
      </button>
    </div>
  );
}
