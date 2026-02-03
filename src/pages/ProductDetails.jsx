import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Lista de productos (igual que en Dashboard)
    const products = [
        {
            id: 1,
            name: "Air Urban Classic",
            price: 129.99,
            category: "classics",
            rating: 4.8,
            reviews: 234,
            badge: "Bestseller",
            image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
            description: "Las Air Urban Classic son el equilibrio perfecto entre estilo urbano y comodidad excepcional. Diseñadas para quienes buscan un calzado versátil para el día a día, estas zapatillas combinan materiales premium con una suela de amortiguación avanzada."
        },
        {
            id: 2,
            name: "Street Runner Pro",
            price: 159.99,
            category: "running",
            rating: 4.9,
            reviews: 189,
            badge: "New",
            image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&h=500&fit=crop",
            description: "Diseñadas para los corredores urbanos más exigentes. Las Street Runner Pro ofrecen una respuesta energética superior y un ajuste como un guante. Perfectas para tus carreras matutinas por la ciudad."
        },
        {
            id: 3,
            name: "Metro Comfort Boost",
            price: 139.99,
            category: "comfort",
            rating: 4.7,
            reviews: 156,
            badge: "Popular",
            image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop",
            description: "La comodidad llevada al siguiente nivel. Con tecnología de amortiguación Boost y un diseño ergonómico, las Metro Comfort son ideales para largas jornadas caminando por la ciudad."
        },
        {
            id: 4,
            name: "Retro Wave 2024",
            price: 149.99,
            category: "retro",
            rating: 4.6,
            reviews: 201,
            badge: "Trending",
            image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&h=500&fit=crop",
            description: "Un homenaje a los clásicos de los 80 con un toque moderno. Las Retro Wave 2024 traen de vuelta el estilo vintage con las comodidades del calzado actual. Un must-have para los amantes de lo retro."
        },
        {
            id: 5,
            name: "Urban Elite X",
            price: 179.99,
            category: "premium",
            rating: 5.0,
            reviews: 98,
            badge: "Premium",
            image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=500&h=500&fit=crop",
            description: "La joya de nuestra colección. Las Urban Elite X representan lo mejor en diseño, materiales y tecnología. Fabricadas con cuero italiano y suela de carbono, son la elección de los más exigentes."
        },
        {
            id: 6,
            name: "City Walker Lite",
            price: 99.99,
            category: "casual",
            rating: 4.5,
            reviews: 312,
            badge: "Sale",
            image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=500&h=500&fit=crop",
            description: "Ligeras, cómodas y con un estilo casual que combina con todo. Las City Walker Lite son perfectas para el uso diario, ofreciendo comodidad sin sacrificar el estilo urbano."
        }
    ];

    const product = products.find(p => p.id === parseInt(id));

    if (!product) {
        return (
            <div style={styles.page}>
                <div style={styles.container}>
                    <h1 style={styles.title}>Producto no encontrado</h1>
                    <button style={styles.backButton} onClick={() => navigate('/dashboard')}>
                        ← Volver al catálogo
                    </button>
                </div>
            </div>
        );
    }

    const styles = {
        page: {
            minHeight: '100vh',
            backgroundColor: '#f9fafb',
            padding: '40px 20px'
        },
        container: {
            maxWidth: '900px',
            margin: '0 auto',
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            overflow: 'hidden'
        },
        content: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '40px',
            padding: '40px'
        },
        imageContainer: {
            borderRadius: '12px',
            overflow: 'hidden'
        },
        image: {
            width: '100%',
            height: 'auto',
            display: 'block'
        },
        info: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
        },
        badge: {
            display: 'inline-block',
            backgroundColor: '#ff0000',
            color: 'white',
            padding: '6px 16px',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '16px',
            width: 'fit-content'
        },
        title: {
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '16px'
        },
        price: {
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#ff0000',
            marginBottom: '16px'
        },
        rating: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '24px',
            fontSize: '18px'
        },
        stars: {
            color: '#fbbf24'
        },
        ratingText: {
            color: '#6b7280',
            fontSize: '16px'
        },
        description: {
            fontSize: '16px',
            lineHeight: '1.7',
            color: '#4b5563',
            marginBottom: '32px'
        },
        backButton: {
            backgroundColor: 'transparent',
            color: '#ff0000',
            padding: '14px 28px',
            borderRadius: '8px',
            border: '2px solid #ff0000',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'all 0.2s',
            width: 'fit-content'
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <div style={styles.content}>
                    <div style={styles.imageContainer}>
                        <img src={product.image} alt={product.name} style={styles.image} />
                    </div>

                    <div style={styles.info}>
                        <span style={styles.badge}>{product.badge}</span>
                        <h1 style={styles.title}>{product.name}</h1>
                        <div style={styles.price}>€{product.price}</div>

                        <div style={styles.rating}>
                            <span style={styles.stars}>
                                {'★'.repeat(Math.floor(product.rating))}
                                {'☆'.repeat(5 - Math.floor(product.rating))}
                            </span>
                            <span style={styles.ratingText}>
                                {product.rating} ({product.reviews} reviews)
                            </span>
                        </div>

                        <p style={styles.description}>{product.description}</p>

                        <button
                            style={styles.backButton}
                            onClick={() => navigate('/dashboard')}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#ff0000';
                                e.target.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'transparent';
                                e.target.style.color = '#ff0000';
                            }}
                        >
                            ← Volver al catálogo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
