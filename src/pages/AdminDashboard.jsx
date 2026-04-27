import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard({ auth, onLogout }) {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [section, setSection] = useState('overview');
  const [hoveredRow, setHoveredRow] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({ name: '', price: '', description: '', category: '', stock: '' });
  const [formMsg, setFormMsg] = useState('');

  useEffect(() => {
    if (!auth?.accessToken) { setLoading(false); return; }
    const h = { Authorization: `Bearer ${auth.accessToken}` };
    Promise.all([
      fetch('/api/orders', { headers: h }).then(r => r.json().catch(() => ({}))),
      fetch('/api/products').then(r => r.json().catch(() => ({}))),
    ]).then(([oData, pData]) => {
      setOrders(Array.isArray(oData.orders) ? oData.orders : []);
      setProducts(Array.isArray(pData.data) ? pData.data : Array.isArray(pData.products) ? pData.products : []);
    }).catch(e => setError(e.message)).finally(() => setLoading(false));
  }, [auth?.accessToken]);

  const stats = useMemo(() => {
    const revenue = orders.reduce((s, o) => s + Number(o.total || 0), 0);
    const paid = orders.filter(o => o.status === 'paid' || o.status === 'completed').length;
    return { orders: orders.length, revenue, paid, products: products.length };
  }, [orders, products]);

  const statusColor = s => ({ paid: '#10b981', completed: '#10b981', pending: '#f59e0b', cancelled: '#ef4444' }[s] || '#6b7280');

  const openForm = (p = null) => {
    setEditingProduct(p);
    setForm(p ? { name: p.name, price: p.price, description: p.description || '', category: p.category || '', stock: p.stock || '' } : { name: '', price: '', description: '', category: '', stock: '' });
    setShowForm(true); setFormMsg('');
  };

  const saveProduct = async () => {
    setFormMsg('');
    const body = { ...form, price: Number(form.price), stock: Number(form.stock) };
    const h = { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.accessToken}` };
    try {
      const url = editingProduct ? `/api/products/${editingProduct._id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: h, body: JSON.stringify(body) });
      if (!res.ok) throw new Error('Error al guardar');
      const data = await res.json();
      if (editingProduct) {
        setProducts(products.map(p => p._id === editingProduct._id ? (data.product || data.data || { ...p, ...body }) : p));
      } else {
        setProducts([...products, data.product || data.data || body]);
      }
      setShowForm(false);
    } catch (e) { setFormMsg(e.message); }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Eliminar este producto?')) return;
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${auth.accessToken}` } });
      setProducts(products.filter(p => p._id !== id));
    } catch (e) { alert(e.message); }
  };

  const ChartIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
  const OrderIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
  const ShoeIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
  const LogoutSvg = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );

  const menu = [
    { id: 'overview', label: 'Resumen', icon: <ChartIcon /> },
    { id: 'orders', label: 'Pedidos', icon: <OrderIcon /> },
    { id: 'products', label: 'Productos', icon: <ShoeIcon /> },
  ];

  const statCards = [
    { label: 'Pedidos', val: stats.orders, color: '#3b82f6' },
    { label: 'Completados', val: stats.paid, color: '#10b981' },
    { label: 'Ingresos', val: `${stats.revenue.toFixed(2)} EUR`, color: '#ef4444' },
    { label: 'Productos', val: stats.products, color: '#8b5cf6' },
  ];

  return (
    <div style={st.wrap}>
      <aside style={st.side}>
        <div style={st.logo}>
          <span style={st.logoT}>DropPoint</span>
          <span style={st.logoBadge}>Admin</span>
        </div>
        <nav style={st.nav}>
          {menu.map(m => (
            <button key={m.id} onClick={() => setSection(m.id)}
              style={{ ...st.navBtn, ...(section === m.id ? st.navAct : {}) }}
              onMouseEnter={e => { if (section !== m.id) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = section === m.id ? 'rgba(139,92,246,0.15)' : 'transparent'; }}>
              <span style={{ display: 'flex', alignItems: 'center' }}>{m.icon}</span> {m.label}
            </button>
          ))}
        </nav>
        <div style={st.sideFooter}>
          <button style={st.logoutBtn} onClick={onLogout}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}><LogoutSvg /> Cerrar Sesion</span>
          </button>
        </div>
      </aside>

      <main style={st.main}>
        <header style={st.topBar}>
          <h1 style={st.h1}>{section === 'overview' ? 'Panel de Admin' : section === 'orders' ? 'Gestion de Pedidos' : 'Gestion de Productos'}</h1>
          <p style={st.sub}>Administra tu tienda DropPoint</p>
        </header>

        {loading && <p style={st.muted}>Cargando datos...</p>}
        {error && <p style={st.err}>{error}</p>}

        {!loading && section === 'overview' && (<>
          <div style={st.statsGrid}>
            {statCards.map((c, i) => (
              <div key={i} style={st.statCard}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 24px rgba(0,0,0,0.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)'; }}>
                <div style={{ ...st.statDot, backgroundColor: c.color }} />
                <div><p style={st.statL}>{c.label}</p><p style={st.statV}>{c.val}</p></div>
              </div>
            ))}
          </div>

          <div style={st.card}>
            <h2 style={st.cardT}>Evolucion de Ingresos</h2>
            <CustomLineChart data={orders} />
          </div>

          <div style={st.twoCol}>
            <div style={st.card}>
              <h2 style={st.cardT}>Ultimos pedidos</h2>
              {orders.length === 0 ? <p style={st.muted}>Sin pedidos</p> : (
                <div style={st.tWrap}><table style={st.table}><thead><tr>
                  <th style={st.th}>Fecha</th><th style={st.th}>Estado</th><th style={st.th}>Total</th>
                </tr></thead><tbody>
                  {orders.slice(0, 6).map((o, i) => (
                    <tr key={o._id} style={{ backgroundColor: hoveredRow === `o${i}` ? '#f9fafb' : '', transition: 'background .15s' }}
                      onMouseEnter={() => setHoveredRow(`o${i}`)} onMouseLeave={() => setHoveredRow(null)}>
                      <td style={st.td}>{new Date(o.createdAt).toLocaleDateString('es-ES')}</td>
                      <td style={st.td}><span style={{ ...st.badge, backgroundColor: statusColor(o.status) + '20', color: statusColor(o.status) }}>{o.status}</span></td>
                      <td style={{ ...st.td, fontWeight: 600 }}>{Number(o.total || 0).toFixed(2)} EUR</td>
                    </tr>))}
                </tbody></table></div>
              )}
            </div>
            <div style={st.card}>
              <h2 style={st.cardT}>Productos recientes</h2>
              {products.length === 0 ? <p style={st.muted}>Sin productos</p> : (
                <div style={st.tWrap}><table style={st.table}><thead><tr>
                  <th style={st.th}>Nombre</th><th style={st.th}>Precio</th><th style={st.th}>Stock</th>
                </tr></thead><tbody>
                  {products.slice(0, 6).map((p, i) => (
                    <tr key={p._id || i} style={{ backgroundColor: hoveredRow === `p${i}` ? '#f9fafb' : '', transition: 'background .15s' }}
                      onMouseEnter={() => setHoveredRow(`p${i}`)} onMouseLeave={() => setHoveredRow(null)}>
                      <td style={st.td}>{p.name}</td>
                      <td style={{ ...st.td, fontWeight: 600 }}>{Number(p.price || 0).toFixed(2)} EUR</td>
                      <td style={st.td}>{p.stock ?? '-'}</td>
                    </tr>))}
                </tbody></table></div>
              )}
            </div>
          </div>
        </>)}

        {!loading && section === 'orders' && (
          <div style={st.card}>
            <h2 style={st.cardT}>Todos los pedidos ({orders.length})</h2>
            {orders.length === 0 ? <p style={st.muted}>No hay pedidos registrados.</p> : (
              <div style={st.tWrap}><table style={st.table}><thead><tr>
                <th style={st.th}># ID</th><th style={st.th}>Fecha</th><th style={st.th}>Estado</th>
                <th style={st.th}>Productos</th><th style={st.th}>Total</th>
              </tr></thead><tbody>
                {orders.map((o, i) => (
                  <tr key={o._id} style={{ backgroundColor: hoveredRow === i ? '#f9fafb' : '', transition: 'background .15s' }}
                    onMouseEnter={() => setHoveredRow(i)} onMouseLeave={() => setHoveredRow(null)}>
                    <td style={{ ...st.td, fontFamily: 'monospace', fontSize: '12px', color: '#6b7280' }}>{o._id?.slice(-8).toUpperCase()}</td>
                    <td style={st.td}>{new Date(o.createdAt).toLocaleDateString('es-ES')}</td>
                    <td style={st.td}><span style={{ ...st.badge, backgroundColor: statusColor(o.status) + '20', color: statusColor(o.status) }}>{o.status}</span></td>
                    <td style={st.td}>{Array.isArray(o.products) ? o.products.length : 0}</td>
                    <td style={{ ...st.td, fontWeight: 600 }}>{Number(o.total || 0).toFixed(2)} EUR</td>
                  </tr>))}
              </tbody></table></div>
            )}
          </div>
        )}

        {!loading && section === 'products' && (
          <div style={st.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <h2 style={{ ...st.cardT, margin: 0 }}>Productos ({products.length})</h2>
              <button style={st.addBtn} onClick={() => openForm()}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#dc2626'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#ef4444'}>
                + Nuevo Producto
              </button>
            </div>

            {showForm && (
              <div style={st.formOverlay} onClick={() => setShowForm(false)}>
                <div style={st.formModal} onClick={e => e.stopPropagation()}>
                  <h3 style={{ margin: '0 0 20px', fontSize: '20px' }}>{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h3>
                  {['name', 'price', 'description', 'category', 'stock'].map(f => (
                    <div key={f} style={{ marginBottom: '14px' }}>
                      <label style={st.label}>{({ name: 'Nombre', price: 'Precio', description: 'Descripcion', category: 'Categoria', stock: 'Stock' })[f]}</label>
                      <input style={st.input} type={f === 'price' || f === 'stock' ? 'number' : 'text'}
                        value={form[f]} onChange={e => setForm({ ...form, [f]: e.target.value })}
                        onFocus={e => e.target.style.borderColor = '#ef4444'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                    </div>
                  ))}
                  {formMsg && <p style={st.err}>{formMsg}</p>}
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                    <button style={st.cancelBtn} onClick={() => setShowForm(false)}>Cancelar</button>
                    <button style={st.addBtn} onClick={saveProduct}>Guardar</button>
                  </div>
                </div>
              </div>
            )}

            {products.length === 0 ? <p style={st.muted}>No hay productos.</p> : (
              <div style={st.tWrap}><table style={st.table}><thead><tr>
                <th style={st.th}>Nombre</th><th style={st.th}>Precio</th><th style={st.th}>Categoria</th>
                <th style={st.th}>Stock</th><th style={st.th}>Acciones</th>
              </tr></thead><tbody>
                {products.map((p, i) => (
                  <tr key={p._id || i} style={{ backgroundColor: hoveredRow === i ? '#f9fafb' : '', transition: 'background .15s' }}
                    onMouseEnter={() => setHoveredRow(i)} onMouseLeave={() => setHoveredRow(null)}>
                    <td style={{ ...st.td, fontWeight: 500 }}>{p.name}</td>
                    <td style={{ ...st.td, fontWeight: 600 }}>{Number(p.price || 0).toFixed(2)} EUR</td>
                    <td style={st.td}>{p.category || '-'}</td>
                    <td style={st.td}>{p.stock ?? '-'}</td>
                    <td style={st.td}>
                      <button style={st.editBtn} onClick={() => openForm(p)}>Editar</button>
                      <button style={st.delBtn} onClick={() => deleteProduct(p._id)}>Borrar</button>
                    </td>
                  </tr>))}
              </tbody></table></div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

const CustomLineChart = ({ data }) => {
  if (!data || data.length === 0) return <p style={{ color: '#9ca3af', fontSize: '14px' }}>No hay datos suficientes.</p>;
  
  const grouped = data.reduce((acc, curr) => {
    const date = new Date(curr.createdAt).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
    acc[date] = (acc[date] || 0) + Number(curr.total || 0);
    return acc;
  }, {});

  let points = Object.entries(grouped).map(([date, total]) => ({ date, total }));
  points = points.slice(-10); // keep last 10 points for readability
  if (points.length === 1) points.unshift({ date: '', total: points[0].total });
  
  const w = 1000, h = 200;
  const maxTotal = Math.max(...points.map(p => p.total), 100) * 1.1; // 10% padding top
  const stepX = points.length > 1 ? w / (points.length - 1) : w;
  
  const pathD = points.map((p, i) => {
    const x = i * stepX;
    const y = h - (p.total / maxTotal) * h;
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  return (
    <div style={{ width: '100%', overflowX: 'auto', padding: '10px 0' }}>
      <svg width="100%" height="240" viewBox={`-40 -20 ${w + 80} ${h + 60}`} preserveAspectRatio="none" style={{ minWidth: '600px' }}>
        {[0, 0.5, 1].map(ratio => {
          const y = h - h * ratio;
          return (
            <g key={ratio}>
              <line x1="0" y1={y} x2={w} y2={y} stroke="#f3f4f6" strokeWidth="2" strokeDasharray="5,5" />
              <text x="-10" y={y + 4} fontSize="12" fill="#9ca3af" textAnchor="end">{(maxTotal * ratio).toFixed(0)}€</text>
            </g>
          );
        })}
        <path d={pathD} fill="none" stroke="#8b5cf6" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => {
          const x = i * stepX;
          const y = h - (p.total / maxTotal) * h;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="5" fill="#fff" stroke="#8b5cf6" strokeWidth="3" />
              <text x={x} y={h + 25} fontSize="12" fill="#6b7280" textAnchor="middle">{p.date}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

const st = {
  wrap: { display: 'flex', minHeight: '100vh', fontFamily: "'Segoe UI', Inter, sans-serif", color: '#111827', backgroundColor: '#f3f4f6' },
  side: { width: '250px', backgroundColor: '#111827', color: '#e5e7eb', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50 },
  logo: { padding: '24px 20px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.08)' },
  logoT: { fontSize: '22px', fontWeight: 800, color: '#fff' },
  logoBadge: { fontSize: '11px', fontWeight: 700, backgroundColor: '#8b5cf6', color: '#fff', padding: '2px 8px', borderRadius: '12px' },
  nav: { flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' },
  navBtn: { display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 14px', borderRadius: '10px', border: 'none', backgroundColor: 'transparent', color: '#d1d5db', fontSize: '14px', fontWeight: 500, cursor: 'pointer', transition: 'all .15s', width: '100%', textAlign: 'left' },
  navAct: { backgroundColor: 'rgba(139,92,246,0.15)', color: '#fff' },
  sideFooter: { padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.08)' },
  logoutBtn: { width: '100%', padding: '10px', background: 'transparent', color: '#9ca3af', border: 'none', borderRadius: '10px', fontWeight: 500, fontSize: '14px', cursor: 'pointer', transition: 'all .15s', textAlign: 'center' },
  main: { flex: 1, marginLeft: '250px', padding: '32px', maxWidth: '1200px' },
  topBar: { marginBottom: '28px' },
  h1: { margin: 0, fontSize: '28px', fontWeight: 700 },
  sub: { margin: '4px 0 0', color: '#6b7280', fontSize: '15px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' },
  statCard: { backgroundColor: '#fff', borderRadius: '14px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', transition: 'all .2s' },
  statDot: { width: '12px', height: '12px', borderRadius: '50%', flexShrink: 0 },
  statL: { margin: 0, fontSize: '13px', color: '#6b7280' },
  statV: { margin: '2px 0 0', fontSize: '22px', fontWeight: 700 },
  twoCol: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '24px' },
  card: { backgroundColor: '#fff', borderRadius: '14px', padding: '24px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' },
  cardT: { margin: '0 0 16px', fontSize: '18px', fontWeight: 600 },
  tWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '10px 14px', borderBottom: '2px solid #f3f4f6', fontSize: '12px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' },
  td: { padding: '10px 14px', borderBottom: '1px solid #f9fafb', fontSize: '14px' },
  badge: { display: 'inline-block', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, textTransform: 'capitalize' },
  muted: { color: '#9ca3af', fontSize: '14px' },
  err: { color: '#ef4444', fontWeight: 600, fontSize: '14px' },
  addBtn: { padding: '9px 18px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 600, fontSize: '14px', cursor: 'pointer', transition: 'all .15s' },
  cancelBtn: { padding: '9px 18px', backgroundColor: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '10px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' },
  editBtn: { background: 'none', border: '1px solid #e5e7eb', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', padding: '4px 10px', marginRight: '6px', color: '#3b82f6', fontWeight: 600 },
  delBtn: { background: 'none', border: '1px solid #fecaca', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', padding: '4px 10px', color: '#ef4444', fontWeight: 600 },
  formOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 },
  formModal: { backgroundColor: '#fff', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '460px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' },
  label: { display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' },
  input: { width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #e5e7eb', fontSize: '14px', outline: 'none', transition: 'border .15s', boxSizing: 'border-box' },
};
