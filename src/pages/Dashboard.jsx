export default function Dashboard({ onLogout }) {
  return (
    <div style={{ maxWidth: "600px", margin: "50px auto" }}>
      <h2>Dashboard</h2>
      <p>¡Bienvenido a tu panel de control!</p>
      <button onClick={onLogout}>Cerrar sesión</button>
    </div>
  );
}
