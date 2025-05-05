import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext({
  user: null,
  proveedor: null,
  admin: null,
  login: () => {},
  logout: () => {},
  setProveedor: () => {},
  setAdmin: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [proveedor, setProveedor] = useState(() => {
    const storedProveedor = localStorage.getItem("proveedor");
    return storedProveedor ? JSON.parse(storedProveedor) : null;
  });

  const [admin, setAdmin] = useState(() => {
    const storedAdmin = localStorage.getItem("admin");
    return storedAdmin ? JSON.parse(storedAdmin) : null;
  });

  // Persistencia local
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  useEffect(() => {
    if (proveedor) localStorage.setItem("proveedor", JSON.stringify(proveedor));
    else localStorage.removeItem("proveedor");
  }, [proveedor]);

  useEffect(() => {
    if (admin) localStorage.setItem("admin", JSON.stringify(admin));
    else localStorage.removeItem("admin");
  }, [admin]);

  // ✅ Manejo del login según tipo de usuario
  const login = (userData) => {
    const role = userData?.role;

    if (role === "proveedor") {
      setProveedor(userData);
      setUser(null);
      setAdmin(null);
    } else if (role === "admin") {
      setAdmin(userData);
      setUser(null);
      setProveedor(null);
    } else {
      setUser(userData);
      setProveedor(null);
      setAdmin(null);
    }
  };

  const logout = () => {
    setUser(null);
    setProveedor(null);
    setAdmin(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider
      value={{ user, proveedor, admin, login, logout, setProveedor, setAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
};
