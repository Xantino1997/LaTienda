import Logo from "../assets/logo.png";
import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaUser,
  FaCreditCard,
  FaBox,
  FaTruck,
  FaCalendarAlt,
  FaMobileAlt,
  FaMoneyBillWave
} from "react-icons/fa";
import "../styles/CreditCard.css";
import { v4 as uuidv4 } from "uuid";
import Swal from "sweetalert2";
import html2pdf from "html2pdf.js";
import { CartContext } from "../context/CartContext";

const CreditCard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart, cartItems } = useContext(CartContext);
  const [codigoSeguimiento, setCodigoSeguimiento] = useState("");
  const [datosCompra, setDatosCompra] = useState(null);
  const [direccion, setDireccion] = useState(localStorage.getItem("direccion") || ""); // Traemos la dirección de localStorage
  const [documento, setDocumento] = useState(localStorage.getItem("documento") || ""); // Traemos el documento de localStorage
  const [telefono, setTelefono] = useState(localStorage.getItem("telefono") || ""); // Traemos el telefono de localStorage
  const [totalFinal, setTotalFinal] = useState(localStorage.getItem("totalFinal") || 0); // Traemos el totalFinal de localStorage

  useEffect(() => {
    const codigo = uuidv4().slice(0, 8).toUpperCase();
    setCodigoSeguimiento(codigo);

    // Intentamos obtener los datos del carrito desde localStorage
    const carrito = JSON.parse(localStorage.getItem("cart"));

    if (carrito) {
      setDatosCompra({
        productos: carrito, // Usamos los productos del carrito
      });
    }
  }, []);

  const handleFinalizarCompra = async () => {
    if (
      !datosCompra ||
      !datosCompra.productos ||
      datosCompra.productos.length === 0
    ) {
      alert("❌ No hay productos para procesar.");
      return;
    }
  
    if (!direccion || !documento || !telefono) {
      Swal.fire(
        "Error",
        "Por favor ingresa tu dirección y documento.",
        "error"
      );
      return;
    }
  
    const productosSincronizados = datosCompra.productos.map((producto) => {
      const enCarrito = cartItems.find((c) => c._id === producto._id);
      const idProducto = producto._id || producto.id;
      return {
        ...producto,
        _id: idProducto,
        cantidad: enCarrito?.cantidad ?? producto.cantidad ?? 1,
      };
    });
  
    const data = {
      ...datosCompra,
      productos: productosSincronizados,
      totalFinal,
      codigoSeguimiento,
      direccion,
      documento,
      telefono,
      fecha: new Date().toISOString(),
    };
  
    try {
      const res = await fetch("http://localhost:5000/api/compra", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
  
      if (!res.ok) throw new Error("Error al guardar la compra");
  
      // Actualizamos el stock de los productos
      for (const item of productosSincronizados) {
        const cantidadComprada = item.cantidad;
  
        if (!item._id || isNaN(cantidadComprada) || cantidadComprada <= 0)
          continue;
  
        await fetch(
          `http://localhost:5000/api/products/update-stock/${item._id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cantidadComprada }),
          }
        );
      }
  
      await Swal.fire(
        "¡Compra exitosa!",
        `Tu código de seguimiento es ${codigoSeguimiento}`,
        "success"
      );
  
      // Limpiar el localStorage después de la compra exitosa
      localStorage.removeItem("direccion");
      localStorage.removeItem("documento");
      localStorage.removeItem("telefono");
      localStorage.removeItem("totalFinal");
      clearCart([]); // Limpiar el carrito
      localStorage.removeItem("cart"); // Limpiar el carrito del localStorage
      navigate("/");
  
    } catch (error) {
      console.error("❌ Error:", error);
      Swal.fire("Error", error.message || "Error desconocido", "error");
    }
  };
  

  const handleDescargarPDF = () => {
    const element = document.getElementById("ticket");
    const buttons = document.querySelectorAll(".ticket-buttons");
    buttons.forEach((b) => b.classList.add("hide-buttons"));

    const nombreProducto = datosCompra?.productos?.[0]?.nombre || "ticket";

    html2pdf()
      .from(element)
      .save(`ticket-${nombreProducto}.pdf`)
      .then(() => {
        buttons.forEach((b) => b.classList.remove("hide-buttons"));
      });
  };

  const calcularTotalFinal = () => {
    const subtotal = datosCompra.productos.reduce((acc, item) => {
      const cantidad = Number(item.quantity) || 0;
      const precio = Number(item.price) || 0;
      return acc + cantidad * precio;
    }, 0);
    const costoEnvio =
      typeof datosCompra.costoEnvio === "number" ? datosCompra.costoEnvio : 0;
    return subtotal + costoEnvio;
  };

  if (!datosCompra) return <p>Cargando...</p>;

  return (
    <div className="ticket-container">
      <div className="ticket" id="ticket">
        <h2 className="ticket-title">🎟️ Ticket de Compra</h2>
        <img src={Logo} alt="Logo Tienda" className="logo-img" />

        <div className="ticket-section" style={{ textAlign: "center" }}>
          <label>
            <FaBox /> <strong>Productos</strong>
          </label>
          <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
            {datosCompra.productos?.map((item, index) => (
              <React.Fragment key={index}>
                <hr />
                <li>
                  <strong>
                    {item.name || "Nombre no disponible"} X {item.quantity || 0}
                  </strong>
                  <br />
                  Precio unitario: ${item.price?.toLocaleString("es-AR") || 0}
                  <br />
                  <em>
                    Proveedor:{" "}
                    <strong>{item.proveedor || "Proveedor desconocido"}</strong>
                  </em>
                </li>
              </React.Fragment>
            ))}
          </ul>
        </div>

        <div className="ticket-section">
          <label>
            <FaMapMarkerAlt /> Dirección:
          </label>
          <p>{direccion || "No se ha ingresado dirección"}</p>
        </div>
        <div className="ticket-section">
          <label>
            <FaUser /> Documento:
          </label>
          <p>{documento || "No se ha ingresado documento"}</p>
        </div>
        <div className="ticket-section">
          <label>
            <FaMobileAlt /> Telefono:
          </label>
          <p>{telefono || "No se ha ingresado documento"}</p>
        </div>
        <div className="ticket-section">
          <label>
            <FaCreditCard /> Método de pago:
          </label>{" "}
          Tarjeta
        </div>
        <div className="ticket-section">
          <label>
            <FaTruck /> Envío:
          </label>{" "}
          {datosCompra.costoEnvio?.toLocaleString("es-AR") || "A confirmar"}
        </div>
        <div className="ticket-section">
          <label> <FaMoneyBillWave /> Total:</label> ${totalFinal.toLocaleString("es-AR")}
        </div>
        <div className="ticket-section">
          <label>Código de seguimiento:</label> {codigoSeguimiento}
        </div>
        <div className="ticket-section">
          <FaCalendarAlt /> <em>Fecha: {new Date().toLocaleString()}</em>
        </div>

        <p className="gracias">¡Gracias por su compra! 🛍️</p>
      </div>

      <div className="ticket-buttons">
        <button className="btn-finalizar" onClick={handleFinalizarCompra}>
          Finalizar y Enviar
        </button>
        <button className="btn-pdf" onClick={handleDescargarPDF}>
          Descargar PDF
        </button>
      </div>
    </div>
  );
};

export default CreditCard;
