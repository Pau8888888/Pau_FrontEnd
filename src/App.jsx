import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';

import Login from './pages/Login';
import Register from './pages/Register';
import StoreDashboard from './pages/Dashboard';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Success from './pages/Success';
import Cancel from './pages/Cancel';
import { clearAuth, decodeJwtPayload, getStoredAuth, saveAuth } from './utils/auth';

function ProtectedRoute({ isAuthenticated, userRole, allowedRoles, children }) {
  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to='/dashboard' replace />;
  }
  return children;
}

function DashboardLanding({ isAuthenticated, userRole }) {
  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }
  if (userRole === 'admin') {
    return <Navigate to='/admin/dashboard' replace />;
  }
  if (userRole === 'client') {
    return <Navigate to='/user/dashboard' replace />;
  }
  return <Navigate to='/login' replace />;
}

function App() {
  const [auth, setAuth] = useState(() => getStoredAuth());

  const isAuthenticated = Boolean(auth.accessToken) && Boolean(auth.role);
  const userRole = auth.role;

  const handleLogin = (accessToken, refreshToken, userData = {}) => {
    const payload = decodeJwtPayload(accessToken);
    const role = userData.role || payload?.role || null;
    const userId = userData.id || payload?.id || null;
    saveAuth({ accessToken, refreshToken, role, userId });
    setAuth(getStoredAuth());
  };

  const handleLogout = () => {
    clearAuth();
    setAuth({ accessToken: null, refreshToken: null, role: null, userId: null, email: null });
  };

  return (
    <Router>
      <Routes>
        <Route
          path='/login'
          element={isAuthenticated ? <Navigate to='/dashboard' replace /> : <Login onLogin={handleLogin} />}
        />
        <Route
          path='/register'
          element={isAuthenticated ? <Navigate to='/dashboard' replace /> : <Register />}
        />
        <Route path='/dashboard' element={<DashboardLanding isAuthenticated={isAuthenticated} userRole={userRole} />} />
        <Route
          path='/user/dashboard'
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole} allowedRoles={['client']}>
              <UserDashboard auth={auth} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path='/admin/dashboard'
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole} allowedRoles={['admin']}>
              <AdminDashboard auth={auth} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path='/store'
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole} allowedRoles={['client']}>
              <StoreDashboard onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path='/producto/:id'
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole} allowedRoles={['client']}>
              <ProductDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path='/cart'
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole} allowedRoles={['client']}>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path='/checkout'
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole} allowedRoles={['client']}>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path='/checkout/success'
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole} allowedRoles={['client']}>
              <Success />
            </ProtectedRoute>
          }
        />
        <Route
          path='/checkout/cancel'
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole} allowedRoles={['client']}>
              <Cancel />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<Navigate to='/dashboard' replace />} />
      </Routes>
    </Router>
  );
}

export default App;