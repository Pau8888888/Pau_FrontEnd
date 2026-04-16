import { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const steps = ["Envío", "Pago", "Resumen"];

const initialForm = {
  name: "",
  email: "",
  address: "",
  city: "",
  zip: "",
  country: "ES",
  cardName: "", // Lo mantenemos para facturación, pero no lo usamos para pagar
};

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const cartItems = useMemo(() => {
    const items = location.state?.cartItems ?? [];
    return items.map((i) => ({ ...i, qty: i.qty ?? 1 }));
  }, [location.state]);

  const subtotal = cartItems.reduce((s, i) => s + i.qty * i.price, 0);
  const shipping = subtotal > 0 ? 4.99 : 0;
  const total = subtotal + shipping;

  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState("");

  const set = (field) => (e) => {
    const val = e.target.value;
    setForm((f) => ({ ...f, [field]: val }));
    setErrors((er) => ({ ...er, [field]: "" }));
  };

  const validateStep = () => {
    const errs = {};
    if (step === 0) {
      if (!form.name) errs.name = "Nombre obligatorio";
      if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) errs.email = "Email inválido";
      if (!form.address) errs.address = "Dirección obligatoria";
      if (!form.city) errs.city = "Ciudad obligatoria";
      if (!form.zip) errs.zip = "Código postal obligatorio";
    }
    if (step === 1) {
      if (!form.cardName) errs.cardName = "Nombre obligatorio para la tarjeta";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const next = () => {
    if (validateStep()) setStep((s) => s + 1);
  };
  const prev = () => setStep((s) => s - 1);

  // ✅ FUNCIÓN ACTUALIZADA: Llama a Stripe Checkout
  const submit = async () => {
    if (!validateStep()) return;
    if (cartItems.length === 0) {
      alert("El carrito está vacío");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");

      // 👇 LLAMADA A STRIPE (no a /pedidos)
      const response = await fetch("http://localhost:4000/api/checkout/create-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          products: cartItems.map(item => ({
            productId: item._id || (typeof item.id === 'string' ? item.id : String(item.id)),
            quantity: item.qty,
            name: item.name,
            price: item.price,
            imagen: item.image
          })),
          shippingAddress: {
            name: form.name,
            email: form.email,
            street: form.address,
            city: form.city,
            postalCode: form.zip,
            country: form.country
          }
        })
      });

      const data = await response.json();

      if (response.ok && data.url) {
        // 🚀 REDIRECCIÓN A STRIPE CHECKOUT
        window.location.href = data.url;
      } else {
        alert(`Error: ${data.message || "No se pudo crear la sesión de pago"}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0 && !done) {
    return (
      <div style={styles.page}>
        <div style={styles.emptyBox}>
          <h2 style={{ margin: 0, color: "#111827" }}>Tu carrito está vacío</h2>
          <p style={{ color: "#666", textAlign: "center" }}>
            Añade productos antes de continuar con el checkout.
          </p>
          <button style={styles.btnPrimary} onClick={() => navigate("/dashboard")}>
            Volver a la tienda
          </button>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <Success
        name={form.name}
        orderId={orderId}
        onBack={() => navigate("/dashboard", { state: { clearCart: true } })}
      />
    );
  }

  return (
    <div style={styles.page}>
      <style>{css}</style>
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={{ ...styles.logo, cursor: "pointer" }} onClick={() => navigate("/dashboard")}>
            DropPoint
          </div>
          <Stepper step={step} />
        </div>

        <div style={styles.body}>
          <div style={styles.formPanel}>
            {step === 0 && <ShippingStep form={form} set={set} errors={errors} />}
            {step === 1 && <PaymentStep form={form} set={set} errors={errors} />}
            {step === 2 && <SummaryStep form={form} />}

            <div style={styles.btnRow}>
              {step > 0 && (
                <button style={styles.btnSecondary} onClick={prev}>
                  ← Atrás
                </button>
              )}
              {step < 2 && (
                <button style={styles.btnPrimary} onClick={next}>
                  Continuar →
                </button>
              )}
              {step === 2 && (
                <button
                  style={{ ...styles.btnPrimary, minWidth: 180, opacity: loading ? 0.7 : 1 }}
                  onClick={submit}
                  disabled={loading}
                >
                  {loading ? "Procesando…" : "Pagar con Stripe"}
                </button>
              )}
            </div>
          </div>

          <div style={styles.sidebar}>
            <OrderSummary cartItems={cartItems} subtotal={subtotal} shipping={shipping} total={total} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ... [Stepper, Field, Input, ShippingStep se mantienen igual] ...
function Stepper({ step }) {
  return (
    <div style={styles.stepper}>
      {steps.map((s, i) => (
        <div key={s} style={styles.stepItem}>
          <div
            style={{
              ...styles.stepDot,
              background: i <= step ? "#ff0000" : "#e0e0e0",
              color: i <= step ? "#fff" : "#999",
            }}
          >
            {i + 1}
          </div>
          <span style={{ ...styles.stepLabel, color: i <= step ? "#111827" : "#aaa" }}>{s}</span>
          {i < steps.length - 1 && (
            <div style={{ ...styles.stepLine, background: i < step ? "#ff0000" : "#e0e0e0" }} />
          )}
        </div>
      ))}
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div style={styles.field}>
      <label style={styles.label}>{label}</label>
      {children}
      {error && <span style={styles.error}>{error}</span>}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = "text", error }) {
  return (
    <input
      className={`checkout-input${error ? " input-error" : ""}`}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={styles.input}
    />
  );
}

function ShippingStep({ form, set, errors }) {
  return (
    <div>
      <h2 style={styles.stepTitle}>Datos de envío</h2>
      <div style={styles.row}>
        <Field label="Nombre completo" error={errors.name}>
          <Input value={form.name} onChange={set("name")} placeholder="Juan García" error={errors.name} />
        </Field>
        <Field label="Correo electrónico" error={errors.email}>
          <Input type="email" value={form.email} onChange={set("email")} placeholder="juan@ejemplo.com" error={errors.email} />
        </Field>
      </div>
      <Field label="Dirección" error={errors.address}>
        <Input value={form.address} onChange={set("address")} placeholder="Calle Mayor, 12" error={errors.address} />
      </Field>
      <div style={styles.row}>
        <Field label="Ciudad" error={errors.city}>
          <Input value={form.city} onChange={set("city")} placeholder="Madrid" error={errors.city} />
        </Field>
        <Field label="Código postal" error={errors.zip}>
          <Input value={form.zip} onChange={set("zip")} placeholder="28001" error={errors.zip} />
        </Field>
        <Field label="País">
          <select value={form.country} onChange={set("country")} style={styles.input}>
            <option value="ES">España</option>
            <option value="FR">Francia</option>
            <option value="DE">Alemania</option>
            <option value="IT">Italia</option>
          </select>
        </Field>
      </div>
    </div>
  );
}

// ✅ PaymentStep SIMPLIFICADO: Ya no pide datos de tarjeta
function PaymentStep({ form, set, errors }) {
  return (
    <div>
      <h2 style={styles.stepTitle}>Datos de facturación</h2>

      <Field label="Nombre en la tarjeta" error={errors.cardName}>
        <Input value={form.cardName} onChange={set("cardName")} placeholder="Juan García" error={errors.cardName} />
      </Field>

      <div style={styles.stripeNotice}>
        <div>
          <strong>Pago seguro con Stripe</strong>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#666" }}>
            Serás redirigido a la página segura de Stripe para completar el pago.
            No guardamos tus datos de tarjeta.
          </p>
        </div>
      </div>

      <div style={styles.paymentMethods}>
        <span style={styles.badge}>Visa</span>
        <span style={styles.badge}>Mastercard</span>
        <span style={styles.badge}>Amex</span>
        <span style={styles.badge}>Apple Pay</span>
      </div>
    </div>
  );
}

function SummaryStep({ form }) {
  return (
    <div>
      <h2 style={styles.stepTitle}>Resumen del pedido</h2>
      <div style={styles.summarySection}>
        <h3 style={styles.summarySubtitle}>Envío</h3>
        <p style={styles.summaryText}>
          {form.name} · {form.email}
        </p>
        <p style={styles.summaryText}>
          {form.address}, {form.city} {form.zip}
        </p>
      </div>
      <div style={styles.summarySection}>
        <h3 style={styles.summarySubtitle}>Pago</h3>
        <p style={styles.summaryText}>Procesado de forma segura por Stripe</p>
      </div>
    </div>
  );
}

function OrderSummary({ cartItems, subtotal, shipping, total }) {
  return (
    <div style={styles.summaryBox}>
      <h3 style={styles.summaryTitle}>Tu pedido</h3>
      {cartItems.map((item) => (
        <div key={item.cartId || item.id} style={styles.cartItem}>
          <div>
            <p style={styles.itemName}>{item.name}</p>
            <p style={styles.itemQty}>Cantidad: {item.qty}</p>
          </div>
          <span style={styles.itemPrice}>{(item.qty * item.price).toFixed(2)} €</span>
        </div>
      ))}
      <div style={styles.divider} />
      <div style={styles.summaryRow}>
        <span>Subtotal</span>
        <span>{subtotal.toFixed(2)} €</span>
      </div>
      <div style={styles.summaryRow}>
        <span>Envío</span>
        <span>{shipping.toFixed(2)} €</span>
      </div>
      <div style={styles.divider} />
      <div style={{ ...styles.summaryRow, fontWeight: 700, fontSize: 18 }}>
        <span>Total</span>
        <span>{total.toFixed(2)} €</span>
      </div>
    </div>
  );
}

function Success({ name, orderId, onBack }) {
  const firstName = name.trim().split(" ")[0] || "cliente";
  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={styles.successBox}>
        <div style={styles.successIcon}>✓</div>
        <h2 style={{ margin: "16px 0 8px", color: "#111827" }}>¡Gracias, {firstName}!</h2>
        <p style={{ color: "#666", textAlign: "center" }}>
          Tu pedido se ha procesado con éxito.
          <br />
          {orderId ? `ID del pedido: ${orderId}` : "Recibirás un correo de confirmación pronto."}
        </p>
        <button style={{ ...styles.btnPrimary, marginTop: 24 }} onClick={onBack}>
          Volver a la tienda
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f9fafb",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    display: "flex",
    justifyContent: "center",
    padding: "40px 16px",
  },
  container: { width: "100%", maxWidth: 960 },
  header: { display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 32, gap: 20 },
  logo: { fontSize: 24, fontWeight: 700, color: "#111827" },
  stepper: { display: "flex", alignItems: "center" },
  stepItem: { display: "flex", alignItems: "center", gap: 8 },
  stepDot: { width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, transition: "all .3s" },
  stepLabel: { fontSize: 13, fontWeight: 600, transition: "color .3s", whiteSpace: "nowrap" },
  stepLine: { width: 48, height: 2, margin: "0 8px", transition: "background .3s" },
  body: { display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" },
  formPanel: { flex: "1 1 500px", background: "#fff", borderRadius: 16, padding: 32, boxShadow: "0 4px 24px rgba(0,0,0,.07)" },
  sidebar: { flex: "0 0 280px" },
  stepTitle: { fontSize: 20, fontWeight: 700, color: "#111827", marginBottom: 24, marginTop: 0 },
  row: { display: "flex", gap: 16, flexWrap: "wrap" },
  field: { flex: "1 1 160px", display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 },
  label: { fontSize: 12, fontWeight: 600, color: "#555", textTransform: "uppercase", letterSpacing: 0.5 },
  input: { padding: "10px 14px", border: "1.5px solid #e0e0e0", borderRadius: 8, fontSize: 14, color: "#111827", outline: "none", fontFamily: "inherit", background: "#fafafa", width: "100%", boxSizing: "border-box" },
  error: { fontSize: 11, color: "#ef4444" },
  btnRow: { display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24, paddingTop: 16, borderTop: "1px solid #f0f0f0" },
  btnPrimary: { background: "#ff0000", color: "#fff", border: "none", padding: "12px 28px", borderRadius: 8, fontFamily: "inherit", fontWeight: 700, fontSize: 15, cursor: "pointer" },
  btnSecondary: { background: "transparent", color: "#555", border: "1.5px solid #ddd", padding: "12px 20px", borderRadius: 8, fontFamily: "inherit", fontWeight: 600, fontSize: 15, cursor: "pointer" },

  // ✅ Nuevos estilos para PaymentStep
  stripeNotice: {
    display: "flex",
    gap: 12,
    alignItems: "flex-start",
    background: "#f0f9ff",
    border: "1px solid #bae6fd",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  lockIcon: {
    fontSize: 20,
  },
  paymentMethods: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    marginTop: 8,
  },
  badge: {
    background: "#f3f4f6",
    padding: "4px 12px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
    color: "#374151",
  },

  summaryBox: { background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 4px 24px rgba(0,0,0,.07)" },
  summaryTitle: { fontSize: 17, fontWeight: 700, color: "#111827", marginBottom: 20, marginTop: 0 },
  cartItem: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 },
  itemName: { margin: 0, fontWeight: 600, fontSize: 14, color: "#111827" },
  itemQty: { margin: "4px 0 0", fontSize: 12, color: "#888" },
  itemPrice: { fontWeight: 700, fontSize: 14, color: "#ff0000" },
  divider: { height: 1, background: "#f0f0f0", margin: "12px 0" },
  summaryRow: { display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 8, color: "#555" },
  summarySection: { marginBottom: 20 },
  summarySubtitle: { fontSize: 12, fontWeight: 700, color: "#111827", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 },
  summaryText: { margin: "2px 0", fontSize: 14, color: "#555" },
  successBox: { background: "#fff", borderRadius: 20, padding: 48, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, boxShadow: "0 8px 40px rgba(0,0,0,.1)", maxWidth: 400 },
  successIcon: { width: 72, height: 72, borderRadius: "50%", background: "#ff0000", color: "#fff", fontSize: 32, display: "flex", alignItems: "center", justifyContent: "center" },
  emptyBox: { background: "#fff", borderRadius: 20, padding: 48, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, boxShadow: "0 8px 40px rgba(0,0,0,.1)", maxWidth: 420 },
};

const css = `
  .checkout-input:focus { border-color: #ff0000 !important; box-shadow: 0 0 0 3px rgba(255,0,0,.1); }
  .input-error { border-color: #ef4444 !important; }
`;