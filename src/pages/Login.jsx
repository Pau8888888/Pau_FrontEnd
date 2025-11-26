import { Link } from "react-router-dom";

export default function Login({ onLogin }) {
  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2>Login</h2>
      <form onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
        <input type="email" placeholder="Email" required style={{ display: "block", marginBottom: "10px", width: "100%" }} />
        <input type="password" placeholder="Password" required style={{ display: "block", marginBottom: "10px", width: "100%" }} />
        <button type="submit">Entrar</button>
      </form>
      <p>¿No tienes cuenta? <Link to="/register">Regístrate</Link></p>
    </div>
  );
}
