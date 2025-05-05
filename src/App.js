import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LogoSplash from "./components/LogoSplash";

import SeguimientoCompra from "./compras/SeguimientoCompra";
import PagoEnPlataforma from "./hooks/PagoEnPlataforma";
import HomePage from "./pages/HomePage";
import AminDashBoard from "./pages/AdminDashBoard";
import OperadorCard from "./pages/Operador";
import ProveedorRegister from "./pages/AdminPro/ProveedorRegister";
import ProveedorAdmin from "./pages/AdminPro/ProveedorAdmin";
import CargarProducto from "./pages/AdminPro/CargarProductos";
import ClientePro from "./pages/ClientePro/ClientePro";
import ClienteRegister from "./pages/ClientePro/ClienteRegister";
import Ofertas from "./pages/Ofertas";
import CompraFin from "./components/CompraFin";
import Login from "./hooks/Login";
import Register from "./hooks/Register";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

// Componente que maneja las rutas con splash incluido
function AppWithSplash() {
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState(null);
  const location = useLocation(); // 👈 detecta cambios de ruta

 // Splash on route change (no mostrar en HomePage "/")
useEffect(() => {
  if (location.pathname === "/") {
    setShowSplash(false);
    return;
  }

  setShowSplash(true);
  const timer = setTimeout(() => {
    setShowSplash(false);
  }, 1500);

  return () => clearTimeout(timer);
}, [location.pathname]);


  // Simular usuario cargado (como si se logueara)
  useEffect(() => {
    const fakeUser = {
      id: 1,
      name: "Admin User",
      role: "admin",
      avatar: "",
    };
    setUser(fakeUser);
  }, []);

  if (showSplash) return <LogoSplash />;

  return (
    <>
      <Navbar user={user} />
    
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/resumen" element={<CompraFin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/admin" element={<AminDashBoard />} />
        <Route path="/proveedor" element={<ProveedorRegister />} />
        <Route path="/carga-producto" element={<CargarProducto />} />
        <Route path="/adminproveedor/:id" element={<ProveedorAdmin />} />
        <Route path="/admincliente/:id" element={<ClientePro />} />
        <Route path="/cliente" element={<ClienteRegister />} />
        <Route path="/seguimiento" element={<SeguimientoCompra />} />
        <Route path="/pago" element={<PagoEnPlataforma />} />
        <Route path="/operador" element={<OperadorCard />} />
        <Route path="/ofertas" element={<Ofertas />} />
      </Routes>
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppWithSplash />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
