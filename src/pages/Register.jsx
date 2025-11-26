import { Link } from "react-router-dom";

export default function Register({ onRegister }) {
  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2>Registro</h2>
      <form onSubmit={(e) => { e.preventDefault(); onRegister(); }}>
        <input type="text" placeholder="Nombre" required style={{ display: "block", marginBottom: "10px", width: "100%" }} />
        <input type="email" placeholder="Email" required style={{ display: "block", marginBottom: "10px", width: "100%" }} />
        <input type="password" placeholder="Password" required style={{ display: "block", marginBottom: "10px", width: "100%" }} />
        <button type="submit">Registrarse</button>
      </form>
      <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
    </div>
  );
}
