import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SECTIONS = ['overview', 'orders', 'account'];

export default function UserDashboard({ auth, onLogout }) {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('overview');
  const [hoveredRow, setHoveredRow] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!auth?.accessToken) { setLoading(false); return; }
      try {
        const res = await fetch('/api/orders/my-orders', {
          headers: { Authorization: `Bearer ${auth.accessToken}` },
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.message || 'No se han podido cargar los pedidos.');
        setOrders(Array.isArray(data.orders) ? data.orders : []);
      } catch (err) { setError(err.message); }
      finally { setLoading(false); }
    };
    fetchOrders();
  }, [auth?.accessToken]);

  const stats = useMemo(() => {
    const totalSpent = orders.reduce((s, o) => s + Number(o.total || 0), 0);
    const paid = orders.filter(o => o.status === 'paid' || o.status === 'completed').length;
    return { totalOrders: orders.length, totalSpent, paidOrders: paid };
  }, [orders]);

  /* ── Status badge helper ─────────────────────── */
  const statusColor = (s) => {
    const map = { paid: '#10b981', completed: '#10b981', pending: '#f59e0b', cancelled: '#ef4444' };
    return map[s] || '#6b7280';
  };

  /* ── SVG icons ────────────────────────────────── */
  const Icon = ({ d, size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );

  const PackageIcon = () => <Icon d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />;
  const CreditIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  );
  const UserIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  );
  const StoreIcon = () => <Icon d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />;
  const LogoutIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
  const ChevronRight = () => <Icon d="M9 18l6-6-6-6" size={16} />;
  const CartSmallIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
  const ShopIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
  const CardIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  );
  const BoxIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );

  /* ── Sidebar menu items ───────────────────────── */
  const menuItems = [
    { id: 'overview', label: 'Resumen', icon: <StoreIcon /> },
    { id: 'orders', label: 'Mis Pedidos', icon: <PackageIcon /> },
    { id: 'account', label: 'Mi Cuenta', icon: <UserIcon /> },
  ];

  /* ── Stat cards data ──────────────────────────── */
  const statCards = [
    { label: 'Pedidos totales', value: stats.totalOrders, color: '#3b82f6', icon: <PackageIcon /> },
    { label: 'Pedidos completados', value: stats.paidOrders, color: '#10b981', icon: <CreditIcon /> },
    { label: 'Total gastado', value: `${stats.totalSpent.toFixed(2)} €`, color: '#ef4444', icon: <CreditIcon /> },
  ];

  /* ────────────────────────────────────────────── */
  /*                     RENDER                     */
  /* ────────────────────────────────────────────── */
  return (
    <div style={s.wrapper}>
      {/* ── SIDEBAR ──────────────────────────── */}
      <aside style={s.sidebar}>
        <div style={s.sidebarLogo} onClick={() => navigate('/store')}>
          <span style={s.logoText}>DropPoint</span>
          <span style={s.logoBadge}>Client</span>
        </div>

        <nav style={s.nav}>
          {menuItems.map(item => {
            const active = activeSection === item.id;
            return (
              <button key={item.id} onClick={() => setActiveSection(item.id)}
                style={{ ...s.navItem, ...(active ? s.navItemActive : {}) }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = active ? 'rgba(239,68,68,0.12)' : 'transparent'; }}
              >
                <span style={{ ...s.navIcon, color: active ? '#ef4444' : '#9ca3af' }}>{item.icon}</span>
                <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
                {active && <ChevronRight />}
              </button>
            );
          })}
        </nav>

        <div style={s.sidebarFooter}>
          <button style={s.storeBtn} onClick={() => navigate('/store')}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#dc2626'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#ef4444'}
          >
            Ir a la Tienda
          </button>
          <button style={s.logoutBtn} onClick={onLogout}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <LogoutIcon /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ────────────────────── */}
      <main style={s.main}>
        {/* Top Bar */}
        <header style={s.topBar}>
          <div>
            <h1 style={s.pageTitle}>
              {activeSection === 'overview' && 'Resumen'}
              {activeSection === 'orders' && 'Mis Pedidos'}
              {activeSection === 'account' && 'Mi Cuenta'}
            </h1>
            <p style={s.pageSubtitle}>Bienvenido de vuelta</p>
          </div>
          <button style={s.topBarStoreBtn} onClick={() => navigate('/store')}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#dc2626'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#ef4444'; e.currentTarget.style.transform = ''; }}
          >
            Ir a la Tienda →
          </button>
        </header>

        {/* ─── OVERVIEW SECTION ──────────────── */}
        {activeSection === 'overview' && (
          <>
            {/* Stat cards */}
            <div style={s.statsGrid}>
              {statCards.map((card, i) => (
                <div key={i} style={s.statCard}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.08)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)'; }}
                >
                  <div style={{ ...s.statIconWrap, backgroundColor: card.color + '18', color: card.color }}>
                    {card.icon}
                  </div>
                  <div>
                    <p style={s.statLabel}>{card.label}</p>
                    <p style={s.statValue}>{card.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick actions */}
            <div style={s.card}>
              <h2 style={s.cardTitle}>Accesos rápidos</h2>
              <div style={s.quickGrid}>
                {[
                  { label: 'Ver Tienda', desc: 'Explorar productos', action: () => navigate('/store'), icon: <ShopIcon /> },
                  { label: 'Mi Carrito', desc: 'Ver guardados', action: () => navigate('/cart'), icon: <CartSmallIcon /> },
                  { label: 'Checkout', desc: 'Completar compra', action: () => navigate('/checkout'), icon: <CardIcon /> },
                  { label: 'Mis Pedidos', desc: 'Historial de compras', action: () => setActiveSection('orders'), icon: <BoxIcon /> },
                ].map((item, i) => (
                  <button key={i} style={s.quickCard} onClick={item.action}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = '#ef4444'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; e.currentTarget.style.borderColor = '#f3f4f6'; }}
                  >
                    <span style={s.quickEmoji}>{item.icon}</span>
                    <span style={s.quickLabel}>{item.label}</span>
                    <span style={s.quickDesc}>{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent orders preview */}
            <div style={s.card}>
              <div style={s.cardHeader}>
                <h2 style={s.cardTitle}>Últimos pedidos</h2>
                <button style={s.linkBtn} onClick={() => setActiveSection('orders')}>Ver todos →</button>
              </div>
              {loading && <p style={s.muted}>Cargando pedidos...</p>}
              {!loading && error && <p style={s.errorText}>{error}</p>}
              {!loading && !error && orders.length === 0 && <p style={s.muted}>Aún no tienes pedidos. ¡Visita la tienda!</p>}
              {!loading && !error && orders.length > 0 && (
                <div style={s.tableWrap}>
                  <table style={s.table}>
                    <thead>
                      <tr>
                        <th style={s.th}>Fecha</th><th style={s.th}>Estado</th>
                        <th style={s.th}>Productos</th><th style={s.th}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map((o, i) => (
                        <tr key={o._id} style={{ backgroundColor: hoveredRow === i ? '#f9fafb' : 'transparent', transition: 'background .15s' }}
                          onMouseEnter={() => setHoveredRow(i)} onMouseLeave={() => setHoveredRow(null)}>
                          <td style={s.td}>{new Date(o.createdAt).toLocaleDateString('es-ES')}</td>
                          <td style={s.td}>
                            <span style={{ ...s.badge, backgroundColor: statusColor(o.status) + '20', color: statusColor(o.status) }}>
                              {o.status}
                            </span>
                          </td>
                          <td style={s.td}>{Array.isArray(o.products) ? o.products.length : 0}</td>
                          <td style={{ ...s.td, fontWeight: 600 }}>{Number(o.total || 0).toFixed(2)} €</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* ─── ORDERS SECTION ────────────────── */}
        {activeSection === 'orders' && (
          <div style={s.card}>
            <h2 style={s.cardTitle}>Historial de pedidos</h2>
            {loading && <p style={s.muted}>Cargando pedidos...</p>}
            {!loading && error && <p style={s.errorText}>{error}</p>}
            {!loading && !error && orders.length === 0 && (
              <div style={s.emptyState}>
                <span style={{ fontSize: '48px' }}>📦</span>
                <p style={{ fontSize: '18px', fontWeight: 600, marginTop: '16px' }}>No tienes pedidos aún</p>
                <p style={s.muted}>¡Explora la tienda y haz tu primera compra!</p>
                <button style={s.primaryBtn} onClick={() => navigate('/store')}>Ir a la Tienda</button>
              </div>
            )}
            {!loading && !error && orders.length > 0 && (
              <div style={s.tableWrap}>
                <table style={s.table}>
                  <thead>
                    <tr>
                      <th style={s.th}># Pedido</th><th style={s.th}>Fecha</th>
                      <th style={s.th}>Estado</th><th style={s.th}>Productos</th>
                      <th style={s.th}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o, i) => (
                      <tr key={o._id}
                        style={{ backgroundColor: hoveredRow === i ? '#f9fafb' : 'transparent', transition: 'background .15s' }}
                        onMouseEnter={() => setHoveredRow(i)} onMouseLeave={() => setHoveredRow(null)}>
                        <td style={{ ...s.td, fontFamily: 'monospace', fontSize: '13px', color: '#6b7280' }}>
                          {o._id?.slice(-8).toUpperCase()}
                        </td>
                        <td style={s.td}>{new Date(o.createdAt).toLocaleDateString('es-ES')}</td>
                        <td style={s.td}>
                          <span style={{ ...s.badge, backgroundColor: statusColor(o.status) + '20', color: statusColor(o.status) }}>
                            {o.status}
                          </span>
                        </td>
                        <td style={s.td}>{Array.isArray(o.products) ? o.products.length : 0}</td>
                        <td style={{ ...s.td, fontWeight: 600 }}>{Number(o.total || 0).toFixed(2)} €</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ─── ACCOUNT SECTION ───────────────── */}
        {activeSection === 'account' && (
          <div style={s.accountGrid}>
            <div style={s.card}>
              <h2 style={s.cardTitle}>Información personal</h2>
              <div style={s.fieldGroup}>
                <div style={s.field}>
                  <span style={s.fieldLabel}>ID de usuario</span>
                  <span style={s.fieldValue}>{auth?.userId || '—'}</span>
                </div>
                <div style={s.field}>
                  <span style={s.fieldLabel}>Rol</span>
                  <span style={{ ...s.badge, backgroundColor: '#3b82f620', color: '#3b82f6' }}>
                    {auth?.role || '—'}
                  </span>
                </div>
                <div style={s.field}>
                  <span style={s.fieldLabel}>Email</span>
                  <span style={s.fieldValue}>{auth?.email || 'No disponible'}</span>
                </div>
              </div>
            </div>

            <div style={s.card}>
              <h2 style={s.cardTitle}>Estadísticas de cuenta</h2>
              <div style={s.fieldGroup}>
                <div style={s.field}>
                  <span style={s.fieldLabel}>Pedidos realizados</span>
                  <span style={s.fieldValue}>{stats.totalOrders}</span>
                </div>
                <div style={s.field}>
                  <span style={s.fieldLabel}>Pedidos completados</span>
                  <span style={s.fieldValue}>{stats.paidOrders}</span>
                </div>
                <div style={s.field}>
                  <span style={s.fieldLabel}>Importe total</span>
                  <span style={{ ...s.fieldValue, color: '#ef4444', fontWeight: 700 }}>{stats.totalSpent.toFixed(2)} €</span>
                </div>
              </div>
            </div>

            <div style={{ ...s.card, gridColumn: '1 / -1' }}>
              <h2 style={s.cardTitle}>Seguridad</h2>
              <p style={{ ...s.muted, marginBottom: '16px' }}>Gestiona la seguridad de tu cuenta.</p>
              <button style={s.outlineBtn}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#ef4444'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#ef4444'; }}
              >
                Cambiar contraseña
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

/* ────────────────────────────────────────────────── */
/*                      STYLES                        */
/* ────────────────────────────────────────────────── */
const s = {
  wrapper: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: "'Segoe UI', Inter, -apple-system, sans-serif",
    color: '#111827',
    backgroundColor: '#f3f4f6',
  },

  /* ── Sidebar ─────────────────────────────── */
  sidebar: {
    width: '260px',
    backgroundColor: '#111827',
    color: '#e5e7eb',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    top: 0, left: 0, bottom: 0,
    zIndex: 50,
  },
  sidebarLogo: {
    padding: '24px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  },
  logoText: { fontSize: '22px', fontWeight: 800, color: '#fff' },
  logoBadge: {
    fontSize: '11px', fontWeight: 700,
    backgroundColor: '#ef4444', color: '#fff',
    padding: '2px 8px', borderRadius: '12px',
  },
  nav: { flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' },
  navItem: {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '10px 14px', borderRadius: '10px',
    border: 'none', backgroundColor: 'transparent',
    color: '#d1d5db', fontSize: '14px', fontWeight: 500,
    cursor: 'pointer', transition: 'all .15s', width: '100%',
  },
  navItemActive: {
    backgroundColor: 'rgba(239,68,68,0.12)',
    color: '#fff',
  },
  navIcon: { display: 'flex', alignItems: 'center' },
  sidebarFooter: {
    padding: '16px 12px',
    borderTop: '1px solid rgba(255,255,255,0.08)',
    display: 'flex', flexDirection: 'column', gap: '8px',
  },
  storeBtn: {
    width: '100%', padding: '10px',
    backgroundColor: '#ef4444', color: '#fff',
    border: 'none', borderRadius: '10px',
    fontWeight: 600, fontSize: '14px',
    cursor: 'pointer', transition: 'all .15s',
  },
  logoutBtn: {
    width: '100%', padding: '10px',
    background: 'transparent', color: '#9ca3af',
    border: 'none', borderRadius: '10px',
    fontWeight: 500, fontSize: '14px',
    cursor: 'pointer', transition: 'all .15s',
    display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center',
  },

  /* ── Main ────────────────────────────────── */
  main: {
    flex: 1,
    marginLeft: '260px',
    padding: '32px',
    maxWidth: '1100px',
  },
  topBar: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: '28px', flexWrap: 'wrap', gap: '16px',
  },
  pageTitle: { margin: 0, fontSize: '28px', fontWeight: 700 },
  pageSubtitle: { margin: '4px 0 0', color: '#6b7280', fontSize: '15px' },
  topBarStoreBtn: {
    padding: '10px 20px', backgroundColor: '#ef4444', color: '#fff',
    border: 'none', borderRadius: '10px', fontWeight: 600, fontSize: '14px',
    cursor: 'pointer', transition: 'all .15s',
  },

  /* ── Stats ───────────────────────────────── */
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px', marginBottom: '24px',
  },
  statCard: {
    backgroundColor: '#fff', borderRadius: '14px',
    padding: '20px', display: 'flex', alignItems: 'center', gap: '16px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)', transition: 'all .2s',
  },
  statIconWrap: {
    width: '48px', height: '48px', borderRadius: '12px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  statLabel: { margin: 0, fontSize: '13px', color: '#6b7280' },
  statValue: { margin: '4px 0 0', fontSize: '24px', fontWeight: 700 },

  /* ── Cards ───────────────────────────────── */
  card: {
    backgroundColor: '#fff', borderRadius: '14px',
    padding: '24px', marginBottom: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  },
  cardHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: '16px',
  },
  cardTitle: { margin: '0 0 16px', fontSize: '18px', fontWeight: 600 },
  linkBtn: {
    background: 'none', border: 'none',
    color: '#ef4444', fontWeight: 600, fontSize: '14px',
    cursor: 'pointer',
  },

  /* ── Quick actions ───────────────────────── */
  quickGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '14px',
  },
  quickCard: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    gap: '6px', padding: '20px 16px',
    backgroundColor: '#fafafa', borderRadius: '12px',
    border: '1.5px solid #f3f4f6',
    cursor: 'pointer', transition: 'all .2s',
  },
  quickEmoji: { fontSize: '28px' },
  quickLabel: { fontSize: '15px', fontWeight: 600 },
  quickDesc: { fontSize: '12px', color: '#9ca3af' },

  /* ── Table ───────────────────────────────── */
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    textAlign: 'left', padding: '12px 14px',
    borderBottom: '2px solid #f3f4f6',
    fontSize: '12px', fontWeight: 600,
    color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em',
  },
  td: {
    padding: '12px 14px', borderBottom: '1px solid #f9fafb',
    fontSize: '14px',
  },
  badge: {
    display: 'inline-block', padding: '3px 10px',
    borderRadius: '20px', fontSize: '12px', fontWeight: 600,
    textTransform: 'capitalize',
  },

  /* ── Account ─────────────────────────────── */
  accountGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
  },
  fieldGroup: { display: 'flex', flexDirection: 'column', gap: '16px' },
  field: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '12px 0', borderBottom: '1px solid #f3f4f6',
  },
  fieldLabel: { fontSize: '14px', color: '#6b7280' },
  fieldValue: { fontSize: '14px', fontWeight: 500 },

  /* ── Misc ────────────────────────────────── */
  muted: { color: '#9ca3af', fontSize: '14px' },
  errorText: { color: '#ef4444', fontWeight: 600, fontSize: '14px' },
  emptyState: { textAlign: 'center', padding: '48px 16px' },
  primaryBtn: {
    marginTop: '16px', padding: '10px 24px',
    backgroundColor: '#ef4444', color: '#fff',
    border: 'none', borderRadius: '10px',
    fontWeight: 600, fontSize: '14px',
    cursor: 'pointer',
  },
  outlineBtn: {
    padding: '10px 24px',
    backgroundColor: 'transparent', color: '#ef4444',
    border: '2px solid #ef4444', borderRadius: '10px',
    fontWeight: 600, fontSize: '14px',
    cursor: 'pointer', transition: 'all .15s',
  },
};
