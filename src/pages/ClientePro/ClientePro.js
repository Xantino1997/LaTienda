import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import "../../styles/ClientePro.css";

const ClientePro = () => {
  const { id } = useParams();
  const [cliente, setCliente] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();
  const buttonRef = useRef();

  useEffect(() => {
    const fetchCliente = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/cliente/${id}`);
        const data = await res.json();
        setCliente(data);
      } catch (err) {
        console.error("Error al cargar cliente:", err);
      }
    };

    fetchCliente();
  }, [id]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!cliente) return <div>Cargando datos del cliente...</div>;

  return (
    <div>
      <section className="dashboard">
        {/* NAVBAR estilo Cliente PRO */}
        <header className="cliente-navbar">
          <div className="cliente-navbar-content">
            <div
              className="cliente-navbar-left"
              ref={buttonRef}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <div className="hamburger-icon">&#9776;</div>
            </div>
            <nav
              ref={menuRef}
              className={`cliente-navbar-menu ${menuOpen ? "show" : ""}`}
            >
              <a href="/mis-compras">Mis Compras</a>
              <a href="/contactar-admin">Contactar con Admin</a>
              <a href="/gastos-mes">Gastos del Mes</a>
              <a href="/logout">Cerrar Sesión</a>
            </nav>
          </div>
        </header>

        {/* INFO del cliente */}
        <div className="admin-card">
          <img
            src={`http://localhost:5000/uploads/${cliente.imagen}`}
            alt="Avatar cliente"
            className="admin-avatar"
          />
          <div className="admin-info">
            <h2>{cliente.nombre}</h2>
            <p><strong>Usuario: {cliente.nombreCompleto}</strong></p>
          </div>
        </div>

        <h2 className="section-title">Panel de Cliente PRO</h2>

        <div className="features-grid">
          <div className="feature-card">
            <h3>Email</h3>
            <p>{cliente.email}</p>
          </div>
          <div className="feature-card">
            <h3>Teléfono</h3>
            <p>{cliente.telefono || "No especificado"}</p>
          </div>
          <div className="feature-card">
            <h3>Dirección</h3>
            <p>{cliente.direccion || "No especificado"}</p>
          </div>
          <div className="feature-card">
            <h3>Correo Recuperación</h3>
            <p>{cliente.correoRecuperacion || "No especificado"}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ClientePro;
