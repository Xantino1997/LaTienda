import React, { useEffect, useState, useRef, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/AdminPro.css";
import { AuthContext } from "../../context/AuthContext";

const ProveedorAdmin = () => {
  const { id } = useParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const [productosProveedor, setProductosProveedor] = useState([]);
  const menuRef = useRef();
  const buttonRef = useRef();
  const navigate = useNavigate();
  const { user, login, logout, proveedor, setProveedor } =
    useContext(AuthContext);

  useEffect(() => {
    const fetchProveedor = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/proveedor/${id}`);
        const data = await res.json();
        setProveedor(data);
      } catch (err) {
        console.error("Error al cargar proveedor:", err);
      }
    };

    fetchProveedor();
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

  useEffect(() => {
    const fetchProductos = async () => {
      if (!proveedor || !proveedor.nombreEmpresa) return;

      const nombreColeccion =
        "compra" + proveedor.nombreEmpresa.replace(/\s/g, "");
      try {
        const res = await fetch(
          `http://localhost:5000/api/compra/proveedor/${nombreColeccion}`
        );
        const data = await res.json();
        setProductosProveedor(data);
      } catch (err) {
        console.error("Error al cargar productos del proveedor:", err);
      }
    };

    fetchProductos();
  }, [proveedor]);

  if (!proveedor) return <div>Cargando datos del proveedor...</div>;

  const handleCargarProducto = () => {
    localStorage.setItem("nombreEmpresa", proveedor.nombreEmpresa);
    navigate("/carga-producto");
  };
  const formatearFecha = (fechaString) => {
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString("es-AR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };
  

  return (
    <div className="proveedor-container">
      <section className="dashboard">
        <header className="admin-navbar">
          <div className="admin-navbar-content">
            <div
              className="admin-navbar-left"
              ref={buttonRef}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <div className="hamburger-icon">&#9776;</div>
            </div>

            <nav
              ref={menuRef}
              className={`admin-navbar-menu ${menuOpen ? "show" : ""}`}
            >
              <a href="/ventas">Tus Ventas</a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleCargarProducto();
                }}
              >
                Cargar Producto
              </a>
              <a href="/descargar-resumenes">Descargar Resúmenes</a>
              <a href="/contactar-admin">Contactar Admin</a>
              <a href="/editar-perfil">Editar Perfil</a>
              <a href="/logout">Cerrar Sesión</a>
            </nav>
          </div>
        </header>

        <div className="admin-card">
          <img
            src={`http://localhost:5000/uploads/${proveedor.imagen}`}
            alt="Avatar proveedor"
            className="admin-avatar"
          />
          <div className="admin-info">
            <h2>{proveedor.nombreEmpresa}</h2>
            <p>ID Fiscal: {proveedor.numeroFiscal}</p>
          </div>
        </div>

        <h2 className="section-title">Panel de Proveedor</h2>

        <div className="features-grid">
          <div className="feature-card">
            <h3>Email</h3>
            <p>{proveedor.email}</p>
          </div>
          <div className="feature-card">
            <h3>Precio Base</h3>
            <p>${proveedor.precio}</p>
          </div>
          <div className="feature-card">
            <h3>Contacto</h3>
            <p>{proveedor.contacto || "No especificado"}</p>
          </div>
          <div className="feature-card">
            <h3>Correo Recuperación</h3>
            <p>{proveedor.correoRecuperacion || "No especificado"}</p>
          </div>
        </div>

        <h2 className="section-title">
          Productos de {proveedor.nombreEmpresa}
        </h2>

        <div className="product-list">
          {productosProveedor && productosProveedor.length > 0 ? (
            productosProveedor.map((prod) => (
              <div className="product-card" key={prod._id}>
                {prod.oferta === "Sí" && (
                  <span className="offer-label">¡OFERTA!</span>
                )}
                <img
                  src={`http://localhost:5000/uploads/${prod.productos[0].image}`}
                  alt={prod.name}
                />
                <h3>{prod.direccion}</h3>
                <p>Precio: ${prod.productos[0].price}</p>
                <p>Cantidad: {prod.productos[0].quantity}</p>
                <p>Descuento: {prod.productos[0].discount}%</p>
                <p>Proveedor: {prod.productos[0].proveedor}</p>
                <p>Comprado: {formatearFecha(prod.fecha)}</p>
                
                <div className="product-buttons">
                  <button className="btn-edit">{formatearFecha(prod.fecha)}</button>
                  <button className="btn-delete">{prod.codigoSeguimiento}</button>
                </div>
              </div>
            ))
          ) : (
            <p>No hay productos cargados aún.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProveedorAdmin;
