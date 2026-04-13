import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsAuthenticated(Boolean(token));
  }, []);

  const handleLogin = (accessToken, refreshToken) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />}
        />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
        <Route
          path="/producto/:id"
          element={isAuthenticated ? <ProductDetails /> : <Navigate to="/login" />}
        />
        <Route
          path="/cart"
          element={isAuthenticated ? <Cart /> : <Navigate to="/login" />}
        />
        <Route
          path="/checkout"
          element={isAuthenticated ? <Checkout /> : <Navigate to="/login" />}
        />
        <Route
          path="/checkout/success"
          element={isAuthenticated ? <Success /> : <Navigate to="/login" />}
        />
        <Route
          path="/checkout/cancel"
          element={isAuthenticated ? <Cancel /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}


export default App;
