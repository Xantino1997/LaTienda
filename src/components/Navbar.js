import React, { useState, useContext, useEffect } from "react";
import {
  FaUser,
  FaShoppingCart,
  FaBars,
  FaTimes,
  FaTrashAlt,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext"; // Importing AuthContext
import Logo from "../assets/logo.png";
import Swal from "sweetalert2"; // Importing SweetAlert

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity } =
    useContext(CartContext);
  const { user, proveedor, logout, imagen } = useContext(AuthContext); // Accessing AuthContext and logout function
  const [userType, setUserType] = useState("");

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleModal = () => setShowModal(!showModal);
  const goToCart = () => {
    setShowModal(false);
    navigate("/resumen");
  };

  const formatNumber = (num) =>
    num.toLocaleString("es-AR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  // Total general con descuentos individuales
  const totalFinal = cartItems.reduce((acc, item) => {
    const discount = item.discount ? item.discount / 100 : 0;
    const priceWithDiscount = item.price * (1 - discount);
    return acc + priceWithDiscount * item.quantity;
  }, 0);

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Función para eliminar un producto del carrito con confirmación de SweetAlert
  const handleRemoveFromCart = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡Este producto se eliminará de tu carrito!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminarlo",
    }).then((result) => {
      if (result.isConfirmed) {
        removeFromCart(id); // Llamamos a la función removeFromCart con el _id
        Swal.fire("Eliminado", "El producto ha sido eliminado", "success");
      }
    });
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    logout(); // Llamada a la función logout del AuthContext para cerrar sesión
    navigate("/login"); // Redirige al usuario a la página de login
  };

  useEffect(() => {
    if (user) {
      if (user.isAdmin) {
        setUserType("admin");
      } else {
        setUserType("cliente");
      }
    } else if (proveedor) {
      setUserType("proveedor");
    } else {
      setUserType(""); // Si no hay usuario ni proveedor, dejamos el tipo vacío
    }
  }, [user, proveedor, imagen]);

  return (
    <>
      <header className="navbar">
        <Link to="/">
          <img src={Logo} alt="Logo Tienda" className="logo-img" />
        </Link>
        <div className="menu-icon" onClick={toggleMenu}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>
        <nav className={`nav-links ${menuOpen ? "active" : ""}`}>
          <ul>
            <li>
              <Link to="/">Inicio</Link>
            </li>
            <li>
              <Link to="/ofertas">Ofertas</Link>
            </li>
            <li>
              <Link to="/categorias">Categorías</Link>
            </li>
            {user?.isAdmin && (
              <li>
                <Link to={`/adminproveedor/${proveedor?._id}`}>
                  Panel Admin
                </Link>
              </li>
            )}
            {user || proveedor ? (
              <>
                {" "}
                <li>
                  <Link to={`/adminproveedor/${proveedor?._id}`}>
                    Panel Admin
                  </Link>
                </li>
                <li>
                  <Link to="/login" onClick={handleLogout}>
                    Cerrar sesión
                  </Link>
                </li>
              </>
            ) : (
              <li>
                <Link to="/login">
                  <FaUser className="icon" />
                </Link>
              </li>
            )}
            <li className="cart-icon" onClick={toggleModal}>
              <FaShoppingCart />
              <span className="cart-count">{totalItems}</span>
            </li>
          </ul>
        </nav>
        {userType && (
          <div className="user-info">
            {userType === "proveedor" && proveedor && (
              <div className="provider-info">
                <img
                  src={
                    proveedor.imagen
                      ? `http://localhost:5000/uploads/${proveedor.imagen}`
                      : Logo
                  }
                  alt={proveedor.nombreEmpresa || "Proveedor"}
                  className="avatar"
                />
                <br />
                <span>{proveedor.email || "Proveedor"}</span>
              </div>
            )}
            {userType === "cliente" && user && (
              <div className="client-info">
                <img
                  src={
                    user.imagen
                      ? `http://localhost:5000/uploads/${user.imagen}`
                      : Logo
                  }
                  alt={user.name || "Cliente"}
                  className="avatar"
                />
                <span>{user.role || "Cliente"}</span>
              </div>
            )}
            {userType === "admin" && (
              <div className="admin-info">
                <span>Administrador</span>
              </div>
            )}
          </div>
        )}
      </header>

      {showModal && (
        <div className="modal-overlay" onClick={toggleModal}>
          <div className="modal-carrito" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-button" onClick={toggleModal}>
              ×
            </button>
            <h2>Resumen de tu carrito</h2>

            {cartItems.length === 0 ? (
              <p>No tienes productos agregados.</p>
            ) : (
              <ul className="modal-productos">
                {cartItems.map((item) => {
                  const itemDiscount = item.discount || 0;
                  const priceWithDiscount =
                    item.price * (1 - itemDiscount / 100);
                  return (
                    <li key={item._id} className="modal-producto">
                      <img src={item.image} alt={item.name} />
                      <div className="producto-info">
                        <span>
                          {item.name} de {item.proveedor}
                        </span>
                        <div className="cantidad-controles">
                          <button onClick={() => decreaseQuantity(item._id)}>
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button onClick={() => increaseQuantity(item._id)}>
                            +
                          </button>
                        </div>
                        <p>
                          {item.quantity} x{" "}
                          {itemDiscount > 0 ? (
                            <>
                              <span className="precio-original">
                                ${formatNumber(item.price)}
                              </span>{" "}
                              <span className="precio-descuento">
                                ${formatNumber(priceWithDiscount)}
                              </span>
                            </>
                          ) : (
                            <span>${formatNumber(item.price)}</span>
                          )}
                        </p>
                      </div>
                      <button onClick={() => handleRemoveFromCart(item._id)}>
                        <FaTrashAlt />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
            <hr />
            <h3>Total: ${formatNumber(totalFinal)}</h3>
            <button className="btn-ir-carrito" onClick={goToCart}>
              Fin Compra
            </button>
          </div>
        </div>
      )}
    </>
  );
}
