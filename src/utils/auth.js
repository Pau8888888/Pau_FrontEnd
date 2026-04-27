export function decodeJwtPayload(token) {
  if (!token) return null;

  const parts = token.split('.');
  if (parts.length < 2) return null;

  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const json = atob(padded);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function getStoredAuth() {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  const storedRole = localStorage.getItem('userRole');
  const storedUserId = localStorage.getItem('userId');

  const payload = decodeJwtPayload(accessToken);

  return {
    accessToken,
    refreshToken,
    role: storedRole || payload?.role || null,
    userId: storedUserId || payload?.id || null,
    email: payload?.email || null,
  };
}

export function saveAuth({ accessToken, refreshToken, role, userId }) {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);

  if (role) {
    localStorage.setItem('userRole', role);
  } else {
    localStorage.removeItem('userRole');
  }

  if (userId) {
    localStorage.setItem('userId', userId);
  } else {
    localStorage.removeItem('userId');
  }
}

export function clearAuth() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userId');
}
