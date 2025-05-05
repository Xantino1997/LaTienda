import React from "react";
import { Link } from "react-router-dom";
import "../styles/AdminDashBoard.css";
import Navbar from "../components/Navbar";
import {
  FaUserShield,
  FaBoxOpen,
  FaHandshake,
  FaTruckLoading,
  FaUserCog,
  FaStore,
  FaBox,
  FaShoppingBag,
} from "react-icons/fa";

import avatar from "../assets/avatar-admin.png"; // Asegurate de tener este archivo en assets

const AdminDashboard = () => {
  const adminName = "Gabriel Reynoso"; // Podés reemplazarlo por datos reales o de sesión

  return (
    <div>
      {" "}
      <Navbar />
      <section className="dashboard">
        {/* Tarjeta del admin */}
        <div className="admin-card">
          <img src={avatar} alt="Admin avatar" className="admin-avatar" />
          <div className="admin-info">
            <h2>Bienvenido, {adminName}</h2>
            <p>Administrador general</p>
          </div>
        </div>

        <h2 className="section-title">Funciones principales</h2>

        {/* Tarjetas de navegación */}
        <div className="nav-card-grid">
          <Link to="/admin" className="nav-card">
            <FaUserShield className="icon" />
            <span>Operador</span>
          </Link>
          <Link to="/products" className="nav-card">
            <FaBoxOpen className="icon" />
            <span>Productos</span>
          </Link>
          <Link to="/vendors" className="nav-card">
            <FaHandshake className="icon" />
            <span>Vendedores</span>
          </Link>
          <Link to="/suppliers" className="nav-card">
            <FaTruckLoading className="icon" />
            <span>Proveedores</span>
          </Link>
        </div>

        {/* Tarjetas informativas */}
        <div className="features-grid">
          <div className="feature-card">
            <FaUserCog className="icon" />
            <h3>Panel de administrador</h3>
            <p>
              Gestioná todo tu negocio de dropshipping desde un solo panel fácil
              de usar.
            </p>
          </div>
          <div className="feature-card">
            <FaStore className="icon" />
            <h3>Múltiples vendedores</h3>
            <p>
              Conectate con varios vendedores para ofrecer una gran variedad de
              productos en tu tienda.
            </p>
          </div>
          <div className="feature-card">
            <FaBox className="icon" />
            <h3>Proveedores confiables</h3>
            <p>
              Colaborá con proveedores confiables para garantizar productos de
              calidad y un cumplimiento eficiente.
            </p>
          </div>
          <div className="feature-card">
            <FaShoppingBag className="icon" />
            <h3>Órdenes de clientes</h3>
            <p>
              Procesá y seguí fácilmente las órdenes de clientes con un sistema
              integrado.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
