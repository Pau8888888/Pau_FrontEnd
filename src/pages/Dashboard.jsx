import React, { useState } from 'react';
import heroSneaker from './img/zapatilla.png';

export default function UrbanSneakersStore() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState({});

  // Añade esta función dentro de tu componente UrbanSneakersStore
// Colócala después de las otras funciones (addToCart, etc.)

const handleCheckout = async () => {
  if (cartItems.length === 0) {
    alert('El carrito está vacío');
    return;
  }

  try {
    // Preparar los datos del pedido
    const orderData = {
      productos: cartItems.map(item => ({
        productoId: item.id.toString(),
        nombre: item.name,
        precio: item.price,
        cantidad: 1, // Puedes modificar esto si tienes cantidades
        imagen: item.image,
        talla: item.size
      })),
      total: cartItems.reduce((sum, item) => sum + item.price, 0),
      cliente: {
        nombre: '', // Puedes añadir un formulario para recoger estos datos
        email: '',
        telefono: '',
        direccion: ''
      },
      estado: 'pendiente'
    };

    // Enviar la petición al backend
    const response = await fetch('http://localhost:4000/api/pedidos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData)
    });

    const data = await response.json();

    if (data.success) {
      alert('¡Pedido realizado con éxito! ID: ' + data.pedido._id);
      // Vaciar el carrito
      setCartItems([]);
      setShowCart(false);
    } else {
      alert('Error al procesar el pedido: ' + data.message);
    }

  } catch (error) {
    console.error('Error:', error);
    alert('Error al conectar con el servidor');
  }
};

// IMPORTANTE: Modifica el botón "Proceder al pago" para usar esta función
// Busca esta línea en tu código:
// <button style={styles.checkoutButton} ...>
// Y añade: onClick={handleCheckout}

  const products = [
    {
      id: 1,
      name: "Air Urban Classic",
      price: 129.99,
      category: "classics",
      rating: 4.8,
      reviews: 234,
      badge: "Bestseller",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop"
    },
    {
      id: 2,
      name: "Street Runner Pro",
      price: 159.99,
      category: "running",
      rating: 4.9,
      reviews: 189,
      badge: "New",
      image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&h=500&fit=crop"
    },
    {
      id: 3,
      name: "Metro Comfort Boost",
      price: 139.99,
      category: "comfort",
      rating: 4.7,
      reviews: 156,
      badge: "Popular",
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop"
    },
    {
      id: 4,
      name: "Retro Wave 2024",
      price: 149.99,
      category: "retro",
      rating: 4.6,
      reviews: 201,
      badge: "Trending",
      image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&h=500&fit=crop"
    },
    {
      id: 5,
      name: "Urban Elite X",
      price: 179.99,
      category: "premium",
      rating: 5.0,
      reviews: 98,
      badge: "Premium",
      image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=500&h=500&fit=crop"
    },
    {
      id: 6,
      name: "City Walker Flex",
      price: 119.99,
      category: "casual",
      rating: 4.5,
      reviews: 167,
      badge: "Sale",
      image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=500&h=500&fit=crop"
    }
  ];

  const categories = [
    { id: 'todos', name: 'Todos' },
    { id: 'classics', name: 'Clásicas' },
    { id: 'running', name: 'Running' },
    { id: 'comfort', name: 'Comfort' },
    { id: 'retro', name: 'Retro' },
    { id: 'premium', name: 'Premium' }
  ];

  const filteredProducts = selectedCategory === 'todos'
    ? products
    : products.filter(p => p.category === selectedCategory);

  const addToCart = (product) => {
    const size = selectedSizes[product.id];
    if (!size) {
      alert('Por favor, selecciona una talla');
      return;
    }

    const newItem = {
      ...product,
      size: size,
      cartId: `${product.id}-${size}-${Date.now()}`
    };

    setCartItems([...cartItems, newItem]);
  };

  // Íconos SVG
  const SearchIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );

  const HeartIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );

  const CartIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );

  const TruckIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M3 3h12l2 6h6l3 3v7H18a2 2 0 0 1-2-2v-2H8a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2H3z" />
      <circle cx="9" cy="10" r="1" />
      <circle cx="17" cy="10" r="1" />
    </svg>
  );

  const ReturnIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
    </svg>
  );

  const ShieldIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );

  const CreditCardIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  );

  const styles = {
    page: {
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    navbar: {
      backgroundColor: 'white',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    },
    navContainer: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '0 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '64px'
    },
    logoText: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#111827'
    },
    navLinks: {
      display: 'flex',
      gap: '32px',
      alignItems: 'center'
    },
    navLink: {
      color: '#374151',
      textDecoration: 'none',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      position: 'relative'
    },
    navLinkHover: {
      color: '#3b82f6'
    },
    navLinkAfter: {
      content: '""',
      position: 'absolute',
      bottom: '-4px',
      left: '0',
      width: '0',
      height: '2px',
      backgroundColor: '#3b82f6',
      transition: 'width 0.2s ease'
    },
    navIcons: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    },
    iconButton: {
      background: 'none',
      border: 'none',
      fontSize: '20px',
      cursor: 'pointer',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      transition: 'background-color 0.2s'
    },
    iconButtonHover: {
      backgroundColor: '#f3f4f6'
    },
    cartBadge: {
      position: 'absolute',
      top: '-6px',
      right: '-6px',
      backgroundColor: '#ef4444',
      color: 'white',
      fontSize: '10px',
      borderRadius: '50%',
      width: '18px',
      height: '18px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold'
    },
    hero: {
      // Cambiamos el degradado a uno más urbano y oscuro
      background: 'linear-gradient(90deg, #111827, #1f2937, #ef4444)', // Negro, gris oscuro, rojo intenso
      color: 'white',
      padding: '80px 20px'
    },
    heroContainer: {
      maxWidth: '1280px',
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '48px',
      alignItems: 'center'
    },
    heroTitle: {
      fontSize: '56px',
      fontWeight: 'bold',
      marginBottom: '24px',
      lineHeight: '1.1'
    },
    heroText: {
      fontSize: '20px',
      marginBottom: '32px',
      opacity: 0.9
    },
    heroImage: {
      width: '100%',
      maxWidth: '1000px',
      height: 'auto',
      objectFit: 'contain'
    },
    heroBadge: {
      display: 'inline-block',
      backgroundColor: 'rgba(255,255,255,0.2)',
      padding: '8px 16px',
      borderRadius: '24px',
      fontSize: '14px',
      fontWeight: '600',
      marginBottom: '24px'
    },
    heroButtons: {
      display: 'flex',
      gap: '16px',
      flexWrap: 'wrap'
    },
    primaryButton: {
      backgroundColor: 'white',
      color: '#3b82f6',
      padding: '16px 32px',
      borderRadius: '8px',
      border: 'none',
      fontWeight: 'bold',
      cursor: 'pointer',
      fontSize: '16px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      transition: 'transform 0.2s, box-shadow 0.2s'
    },
    primaryButtonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 16px rgba(0,0,0,0.25)'
    },
    secondaryButton: {
      backgroundColor: 'transparent',
      color: 'white',
      padding: '16px 32px',
      borderRadius: '8px',
      border: '2px solid white',
      fontWeight: 'bold',
      cursor: 'pointer',
      fontSize: '16px',
      transition: 'background-color 0.2s'
    },
    secondaryButtonHover: {
      backgroundColor: 'rgba(255,255,255,0.15)'
    },
    heroStats: {
      display: 'flex',
      gap: '32px',
      marginTop: '48px'
    },
    stat: {
      fontSize: '32px',
      fontWeight: 'bold'
    },
    statLabel: {
      fontSize: '14px',
      opacity: 0.8
    },

    categoriesSection: {
      backgroundColor: 'white',
      padding: '32px 20px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    categoriesContainer: {
      maxWidth: '1280px',
      margin: '0 auto'
    },
    categoriesTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    categoriesGrid: {
      display: 'flex',
      gap: '12px',
      overflowX: 'auto',
      paddingBottom: '8px'
    },
    categoryButton: (active) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 24px',
      borderRadius: '8px',
      border: 'none',
      fontWeight: '600',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      backgroundColor: active ? '#ff0000' : '#f3f4f6',
      color: active ? 'white' : '#374151',
      boxShadow: active ? '0 4px 12px rgba(255, 0, 0, 0.3)' : 'none',
      transition: 'all 0.2s'
    }),
    categoryButtonHover: (active) => ({
      transform: active ? 'none' : 'translateY(-2px)',
      boxShadow: active ? '0 4px 12px rgba(59, 130, 246, 0.3)' : '0 4px 8px rgba(0,0,0,0.15)'
    }),
    productsSection: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '64px 20px'
    },
    sectionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '32px'
    },
    sectionTitle: {
      fontSize: '36px',
      fontWeight: 'bold',
      color: '#111827'
    },
    sectionSubtitle: {
      color: '#6b7280',
      marginTop: '8px'
    },
    productsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '32px'
    },
    productCard: {
      backgroundColor: 'white',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      transition: 'all 0.3s'
    },
    productCardHover: {
      transform: 'translateY(-6px)',
      boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
    },
    productImageContainer: {
      position: 'relative',
      paddingTop: '100%',
      backgroundColor: '#f3f4f6',
      overflow: 'hidden'
    },
    productImage: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 0.5s'
    },
    productImageHover: {
      transform: 'scale(1.05)'
    },
    badge: (type) => ({
      position: 'absolute',
      top: '16px',
      left: '16px',
      padding: '4px 12px',
      borderRadius: '24px',
      fontSize: '12px',
      fontWeight: 'bold',
      color: 'white',
      backgroundColor:
        type === 'New' ? '#10b981' :
          type === 'Bestseller' ? '#3b82f6' :
            type === 'Sale' ? '#ef4444' :
              type === 'Premium' ? '#9333ea' : '#f59e0b'
    }),
    wishlistButton: {
      position: 'absolute',
      top: '16px',
      right: '16px',
      width: '40px',
      height: '40px',
      backgroundColor: 'white',
      borderRadius: '50%',
      border: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      transition: 'background-color 0.2s'
    },
    wishlistButtonHover: {
      backgroundColor: '#f9fafb'
    },
    productInfo: {
      padding: '24px'
    },
    rating: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '8px',
      color: '#fbbf24',
      fontSize: '16px'
    },
    ratingText: {
      color: '#6b7280',
      fontSize: '14px'
    },
    productName: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: '16px'
    },
    priceRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '16px'
    },
    price: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#111827'
    },
    addButton: {
      backgroundColor: '#ff0000',
      color: 'white',
      padding: '12px 24px',
      borderRadius: '8px',
      border: 'none',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    addButtonHover: {
      backgroundColor: '#bc0b0b',
      transform: 'translateY(-2px)',
    },
    sizes: {
      marginTop: '16px',
      paddingTop: '16px',
      borderTop: '1px solid #e5e7eb'
    },
    sizesLabel: {
      fontSize: '12px',
      color: '#6b7280',
      marginBottom: '8px'
    },
    sizesGrid: {
      display: 'flex',
      gap: '8px',
      justifyContent: 'center'
    },
    sizeButton: {
      width: '40px',
      height: '40px',
      border: '2px solid #e5e7eb',
      borderRadius: '8px',
      backgroundColor: 'white',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      color: '#374151',
      transition: 'all 0.2s'
    },
    sizeButtonHover: {
      borderColor: '#ff0000',
      color: '#ff0000',
      backgroundColor: '#eff6ff'
    },
    sizeButtonActive: {
      borderColor: '#ff0000',
      color: 'white',
      backgroundColor: '#ff0000'
    },
    featuresSection: {
      backgroundColor: '#111827',
      color: 'white',
      padding: '64px 20px'
    },
    featuresGrid: {
      maxWidth: '1280px',
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '32px'
    },
    featureCard: {
      textAlign: 'center'
    },
    featureIconContainer: {
      width: '64px',
      height: '64px',
      backgroundColor: '#ff0000',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 16px',
      fontSize: '32px'
    },
    featureTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      marginBottom: '8px'
    },
    featureText: {
      color: '#9ca3af'
    },
    newsletter: {
      background: 'linear-gradient(90deg, #111827, #1f2937, #ef4444)',
      padding: '64px 20px',
      textAlign: 'center',
      color: 'white'
    },
    newsletterTitle: {
      fontSize: '36px',
      fontWeight: 'bold',
      marginBottom: '16px',
      color: '#ffffffff'
    },
    newsletterText: {
      fontSize: '20px',
      marginBottom: '32px',
      opacity: 0.9
    },
    newsletterForm: {
      display: 'flex',
      gap: '16px',
      maxWidth: '500px',
      margin: '0 auto',
      flexWrap: 'wrap',
      justifyContent: 'center'
    },
    emailInput: {
      flex: 1,
      minWidth: '250px',
      padding: '16px 24px',
      borderRadius: '8px',
      border: 'none',
      fontSize: '16px',
      transition: 'box-shadow 0.2s'
    },
    emailInputFocus: {
      outline: 'none',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.4)'
    },
    subscribeButton: {
      backgroundColor: 'red',
      color: '#ffffff',
      padding: '16px 32px',
      borderRadius: '8px',
      border: 'none',
      fontWeight: 'bold',
      cursor: 'pointer',
      fontSize: '16px'
    },
    subscribeButtonHover: {
      transform: 'translateY(-2px)'
    },
    footer: {
      backgroundColor: '#111827',
      color: '#9ca3af',
      padding: '48px 20px'
    },
    footerContainer: {
      maxWidth: '1280px',
      margin: '0 auto'
    },
    footerGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '32px',
      marginBottom: '32px'
    },
    footerTitle: {
      color: 'white',
      fontWeight: 'bold',
      marginBottom: '16px'
    },
    footerLinks: {
      listStyle: 'none',
      padding: 0,
      margin: 0
    },
    footerLink: {
      marginBottom: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      color: '#9ca3af',
      transition: 'color 0.2s'
    },
    footerLinkHover: {
      color: '#d1d5db'
    },
    socialIcons: {
      display: 'flex',
      gap: '12px',
      marginTop: '16px'
    },
    socialIcon: {
      width: '40px',
      height: '40px',
      backgroundColor: '#1f2937',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    socialIconHover: {
      backgroundColor: '#374151'
    },
    copyright: {
      borderTop: '1px solid #374151',
      paddingTop: '32px',
      textAlign: 'center',
      fontSize: '14px'
    },
    cartModal: {
      position: 'fixed',
      top: 0,
      right: 0,
      width: '400px',
      height: '100vh',
      backgroundColor: 'white',
      boxShadow: '-4px 0 20px rgba(0,0,0,0.2)',
      zIndex: 2000,
      display: 'flex',
      flexDirection: 'column',
      transform: 'translateX(0)',
      transition: 'transform 0.3s ease'
    },
    cartOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: 1999
    },
    cartHeader: {
      padding: '24px',
      borderBottom: '1px solid #e5e7eb',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    cartTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#111827'
    },
    closeButton: {
      background: 'none',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      color: '#6b7280',
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    cartContent: {
      flex: 1,
      overflowY: 'auto',
      padding: '24px'
    },
    cartEmpty: {
      textAlign: 'center',
      padding: '48px 24px',
      color: '#6b7280'
    },
    cartItem: {
      display: 'flex',
      gap: '16px',
      padding: '16px',
      backgroundColor: '#f9fafb',
      borderRadius: '12px',
      marginBottom: '16px'
    },
    cartItemImage: {
      width: '80px',
      height: '80px',
      objectFit: 'cover',
      borderRadius: '8px'
    },
    cartItemInfo: {
      flex: 1
    },
    cartItemName: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#111827',
      marginBottom: '4px'
    },
    cartItemSize: {
      fontSize: '14px',
      color: '#6b7280',
      marginBottom: '8px'
    },
    cartItemPrice: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#ff0000'
    },
    removeButton: {
      background: 'none',
      border: 'none',
      color: '#ef4444',
      cursor: 'pointer',
      fontSize: '20px',
      padding: '4px'
    },
    cartFooter: {
      padding: '24px',
      borderTop: '1px solid #e5e7eb'
    },
    cartTotal: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px',
      fontSize: '20px',
      fontWeight: 'bold'
    },
    checkoutButton: {
      width: '100%',
      backgroundColor: '#ff0000',
      color: 'white',
      padding: '16px',
      borderRadius: '8px',
      border: 'none',
      fontWeight: 'bold',
      fontSize: '16px',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    }
  };

  return (
    <div style={styles.page}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.navContainer}>
          <span
            style={{ ...styles.logoText, cursor: 'pointer' }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            DropPoint
          </span>

          <div style={styles.navLinks}>
            {['Inicio', 'Colecciones', 'Ofertas', 'Contacto'].map((text, i) => (
              <a
                key={i}
                href="#"
                style={{
                  ...styles.navLink,
                  ...(menuOpen && styles.navLinkHover)
                }}
                onMouseEnter={(e) => e.target.style.color = '#ff0000'}
                onMouseLeave={(e) => e.target.style.color = '#333'}
              >
                {text}
              </a>
            ))}
          </div>

          <div style={styles.navIcons}>
            <button
              style={styles.iconButton}
              onClick={() => setShowCart(!showCart)}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              <CartIcon />
              {cartItems.length > 0 && <span style={styles.cartBadge}>{cartItems.length}</span>}
            </button>
            <button
              style={styles.iconButton}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              <HeartIcon />
            </button>
          </div>
        </div>
      </nav>
      {/* Cart Modal */}
      {showCart && (
        <>
          <div style={styles.cartOverlay} onClick={() => setShowCart(false)} />
          <div style={styles.cartModal}>
            <div style={styles.cartHeader}>
              <h2 style={styles.cartTitle}>Tu Carrito</h2>
              <button
                style={styles.closeButton}
                onClick={() => setShowCart(false)}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                ×
              </button>
            </div>

            <div style={styles.cartContent}>
              {cartItems.length === 0 ? (
                <div style={styles.cartEmpty}>
                  <p style={{ fontSize: '18px', marginBottom: '8px' }}>Tu carrito está vacío</p>
                  <p style={{ fontSize: '14px' }}>Añade productos para empezar</p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.cartId} style={styles.cartItem}>
                    <img src={item.image} alt={item.name} style={styles.cartItemImage} />
                    <div style={styles.cartItemInfo}>
                      <div style={styles.cartItemName}>{item.name}</div>
                      <div style={styles.cartItemSize}>Talla: {item.size}</div>
                      <div style={styles.cartItemPrice}>€{item.price}</div>
                    </div>
                    <button
                      style={styles.removeButton}
                      onClick={() => setCartItems(cartItems.filter(i => i.cartId !== item.cartId))}
                      onMouseEnter={(e) => e.target.style.color = '#dc2626'}
                      onMouseLeave={(e) => e.target.style.color = '#ef4444'}
                    >
                      🗑️
                    </button>
                  </div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div style={styles.cartFooter}>
                <div style={styles.cartTotal}>
                  <span>Total:</span>
                  <span>€{cartItems.reduce((sum, item) => sum + item.price, 0).toFixed(2)}</span>
                </div>
                <button
                  style={styles.checkoutButton}
                  onClick={handleCheckout}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#dc2626'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#ff0000'}
                >
                  Proceder al pago
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.heroContainer}>
          <div>
            <h1 style={styles.heroTitle}>Define tu estilo urbano</h1>
            <p style={styles.heroText}>
              Descubre las zapatillas más innovadoras diseñadas para el ritmo de la ciudad moderna. Comodidad, estilo y tecnología en cada paso.
            </p>
            <div style={styles.heroButtons}>
              <button
                style={styles.secondaryButton}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.15)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                Explorar colección
              </button>
              <button
                style={styles.secondaryButton}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.15)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                Ver Ofertas
              </button>
            </div>
            <div style={styles.heroStats}>
              <div>
                <div style={styles.stat}>10K+</div>
                <div style={styles.statLabel}>Clientes felices</div>
              </div>
              <div>
                <div style={styles.stat}>4.9★</div>
                <div style={styles.statLabel}>Valoración media</div>
              </div>
              <div>
                <div style={styles.stat}>500+</div>
                <div style={styles.statLabel}>Modelos</div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img
              src={heroSneaker}
              alt="Hero Sneaker"
              style={{
                ...styles.heroImage,
                mixBlendMode: 'normal',
                objectFit: 'contain'
              }}
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section style={styles.categoriesSection}>
        <div style={styles.categoriesContainer}>
          <h2 style={styles.categoriesTitle}>Categorías</h2>
          <div style={styles.categoriesGrid}>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={styles.categoryButton(selectedCategory === cat.id)}
                onMouseEnter={(e) => {
                  if (selectedCategory !== cat.id) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedCategory !== cat.id) {
                    e.target.style.transform = '';
                    e.target.style.boxShadow = 'none';
                  }
                }}
              >
                <span>{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section style={styles.productsSection}>
        <div style={styles.sectionHeader}>
          <div>
            <h2 style={styles.sectionTitle}>Productos destacados</h2>
          </div>
        </div>

        <div style={styles.productsGrid}>
          {filteredProducts.map(product => (
            <div
              key={product.id}
              style={styles.productCard}
            >
              <div style={styles.productImageContainer}>
                <img
                  src={product.image}
                  alt={product.name}
                  style={styles.productImage}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                />
                <div style={styles.badge(product.badge)}>{product.badge}</div>
                <button
                  style={styles.wishlistButton}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                >
                  <HeartIcon />
                </button>
              </div>

              <div style={styles.productInfo}>
                <div style={styles.rating}>
                  <span>{'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}</span>
                  <span style={styles.ratingText}>{product.rating} ({product.reviews})</span>
                </div>

                <h3 style={styles.productName}>{product.name}</h3>

                <div style={styles.priceRow}>
                  <span style={styles.price}>€{product.price}</span>
                  <button
                    style={styles.addButton}
                    onClick={() => addToCart(product)}
                    onMouseEnter={(e) => Object.assign(e.target.style, styles.addButtonHover)}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#ff0000';
                      e.target.style.transform = '';
                      e.target.style.boxShadow = '0 4px 12px rgba(186, 0, 0, 0.3)';
                    }}
                  >
                    Añadir
                  </button>
                </div>

                <div style={styles.sizes}>
                  <p style={styles.sizesLabel}>Tallas disponibles:</p>
                  <div style={styles.sizesGrid}>
                    {['39', '40', '41', '42', '43'].map(size => {
                      const isSelected = selectedSizes[product.id] === size;

                      return (
                        <button
                          key={size}
                          style={{
                            ...styles.sizeButton,
                            ...(isSelected && styles.sizeButtonActive)
                          }}
                          onClick={() => {
                            setSelectedSizes({
                              ...selectedSizes,
                              [product.id]: isSelected ? null : size
                            });
                          }}
                          onMouseEnter={(e) => {
                            if (!isSelected) {
                              e.target.style.borderColor = '#ff0000';
                              e.target.style.color = '#ff0000';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected) {
                              e.target.style.borderColor = '#e5e7eb';
                              e.target.style.color = '#374151FF';
                              e.target.style.backgroundColor = 'white';
                            }
                          }}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={styles.featuresSection}>
        <div style={styles.featuresGrid}>
          <div style={styles.featureCard}>
            <div style={styles.featureIconContainer}>
              <TruckIcon />
            </div>
            <h3 style={styles.featureTitle}>Envío gratis</h3>
            <p style={styles.featureText}>En pedidos superiores a €50</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIconContainer}>
              <ReturnIcon />
            </div>
            <h3 style={styles.featureTitle}>Devolución 30 días</h3>
            <p style={styles.featureText}>Sin preguntas ni complicaciones</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIconContainer}>
              <ShieldIcon />
            </div>
            <h3 style={styles.featureTitle}>Garantía premium</h3>
            <p style={styles.featureText}>2 años de garantía oficial</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIconContainer}>
              <CreditCardIcon />
            </div>
            <h3 style={styles.featureTitle}>Pago seguro</h3>
            <p style={styles.featureText}>Múltiples métodos de pago</p>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section style={styles.newsletter}>
        <h2 style={styles.newsletterTitle}>Únete a la comunidad DropPoint</h2>
        <p style={styles.newsletterText}>Recibe ofertas exclusivas, novedades y consejos de estilo</p>
        <div style={styles.newsletterForm}>
          <input
            type="email"
            placeholder="tu@email.com"
            style={styles.emailInput}
            onFocus={(e) => {
              e.target.style.borderColor = '#ff0000';
              e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.3)';
              e.target.style.transform = 'scale(1.01)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#ff0000';
              e.target.style.boxShadow = '';
              e.target.style.transform = '';
            }}
          />
          <button
            style={styles.subscribeButton}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f0f9ff';
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'white';
              e.target.style.transform = '';
              e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            }}
          >
            Suscribirse
          </button>
        </div>
        <p style={{ fontSize: '14px', marginTop: '16px', opacity: 0.8 }}>
          Recibe un 15% de descuento en tu primera compra
        </p>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContainer}>
          <div style={styles.footerGrid}>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>DropPoint</div>
              <p style={{ fontSize: '14px', margin: '16px 0', color: '#9ca3af', textAlign: 'left', maxWidth: '200px' }}>
                Tu destino para las mejores zapatillas urbanas del mercado.
              </p>
              <div style={styles.socialIcons}>
                {['f', '𝕏', 'in'].map((icon, i) => (
                  <div
                    key={i}
                    style={styles.socialIcon}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#374151'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#1f2937'}
                  >
                    {icon}
                  </div>
                ))}
              </div>
            </div>

            {['Comprar', 'Ayuda', 'Empresa'].map((title, i) => (
              <div key={i}>
                <h4 style={styles.footerTitle}>{title}</h4>
                <ul style={styles.footerLinks}>
                  {Array.from({ length: 4 }).map((_, j) => (
                    <li
                      key={j}
                      style={styles.footerLink}
                      onMouseEnter={(e) => e.target.style.color = '#d1d5db'}
                      onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
                    >
                      {title === 'Comprar' ? ['Nuevos Lanzamientos', 'Bestsellers', 'Ofertas', 'Outlet'][j]
                        : title === 'Ayuda' ? ['Guía de Tallas', 'Envíos', 'Devoluciones', 'Contacto'][j]
                          : ['Sobre Nosotros', 'Sostenibilidad', 'Trabaja con Nosotros', 'Blog'][j]}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div style={styles.copyright}>
            <p>&copy; 2025 DropPoint. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );

}
