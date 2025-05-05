import React, { useContext, useState, useEffect } from "react";
import Swal from "sweetalert2";
import { CartContext } from "../context/CartContext";
import "../styles/CompraFin.css";

const formatNumber = (num) => num.toLocaleString("es-AR");

export default function CarritoSimple() {
  const { cartItems = [], removeFromCart } = useContext(CartContext);

  // Estado para la dirección y el documento, con valor por defecto desde localStorage
  const [direccion, setDireccion] = useState(localStorage.getItem("direccion") || "");
  const [documento, setDocumento] = useState(localStorage.getItem("documento") || "");
  const [telefono, setTelefono] = useState(localStorage.getItem("telefono") || "");

  const totalProductos = cartItems.reduce((acc, item) => {
    const tieneDescuento = item.discount && item.discount > 0;
    const precioBase = Number(item.price);
    const precioFinal = tieneDescuento
      ? precioBase - (precioBase * item.discount) / 100
      : precioBase;
    return acc + precioFinal * Number(item.quantity);
  }, 0);

  const envio = totalProductos < 250000 ? totalProductos * 0.15 : totalProductos * 0.1;
  const totalFinal = Number((totalProductos + envio).toFixed(2)); // Aseguramos que sea el valor correcto con envío

  const productosDetallados = cartItems.map((item) => {
    const tieneDescuento = item.discount && item.discount > 0;
    const precioUnitario = tieneDescuento
      ? item.price - (item.price * item.discount) / 100
      : item.price;

    const precioTotalProducto = precioUnitario * item.quantity;

    return {
      id: item._id,
      nombre: item.name,
      proveedor: item.proveedor,
      cantidad: item.quantity,
      precioUnitario,
      precioTotalProducto,
      descuento: item.discount || 0
    };
  });

  const guardarCompraEnBD = async () => {
    if (!direccion || !documento|| !telefono) {
      Swal.fire("Error", "Por favor, ingresa todos los datos", "warning");
      return;
    }

    // Guardar dirección, documento y totalFinal en localStorage
    localStorage.setItem("direccion", direccion);
    localStorage.setItem("telefono", telefono);
    localStorage.setItem("documento", documento);
    localStorage.setItem("totalFinal", totalFinal.toString());

    const dataCompra = {
      productos: productosDetallados,
      direccion,
      documento,
      telefono,
      metodoPago: "mercado-pago",
      tarjeta: null,
      vencimiento: null,
      cvv: null,
      titular: null,
      costoEnvio: envio,
      totalFinalConEnvio: totalFinal // Aseguramos que este es el valor correcto
    };

    try {
      const response = await fetch("https://la-tienda-backend.vercel.app/api/compras", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataCompra)
      });

      if (!response.ok) throw new Error("Error al guardar la compra");

      console.log("✅ Compra guardada automáticamente.");
    } catch (err) {
      console.error("❌ Error al guardar la compra:", err);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      guardarCompraEnBD();
    }, 15000);

    return () => clearTimeout(timer); // Limpieza si el usuario abandona antes
  }, [direccion, documento, totalFinal,telefono]); 

  const handleRemove = (id) => {
    Swal.fire({
      title: "¿Eliminar producto?",
      text: "¿Estás seguro que querés quitarlo del carrito?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        removeFromCart(id);
        Swal.fire("Eliminado", "Producto eliminado del carrito", "success");
      }
    });
  };

  const handleMercadoPago = async () => {
    if (!direccion || !documento || !telefono) {
      Swal.fire("Error", "Por favor, ingresa todos los datos", "warning");
      return;
    }

    const productosParaPago = cartItems.map((item) => {
      const tieneDescuento = item.discount && item.discount > 0;
      const precioConDescuento = tieneDescuento
        ? item.price - (item.price * item.discount) / 100
        : item.price;

      return {
        title: item.name,
        quantity: item.quantity,
        unit_price: parseFloat(precioConDescuento.toFixed(2)),
      };
    });

    productosParaPago.push({
      title: "Costo de envío",
      quantity: 1,
      unit_price: parseFloat(envio.toFixed(2)),
    });

    try {
      const mpResponse = await fetch(
        "https://la-tienda-backend.vercel.app/api/mercadopago/create_preference",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: productosParaPago,
            totalFinal,
            direccion,
            documento,
            telefono,
          }),
        }
      );

      if (!mpResponse.ok) throw new Error("Error al crear preferencia");

      const mpData = await mpResponse.json();
      const initPoint = mpData.init_point;

      window.location.href = initPoint;
    } catch (error) {
      console.error("Mercado Pago Error:", error);
      Swal.fire("Error", "No se pudo iniciar el pago. Intentá más tarde.", "error");
    }
  };

  // Actualizar en localStorage cada vez que la dirección, documento o totalFinal cambian
  useEffect(() => {
    localStorage.setItem("direccion", direccion);
    localStorage.setItem("documento", documento);
    localStorage.setItem("telefono", telefono);
    localStorage.setItem("totalFinal", totalFinal.toString());
  }, [direccion, documento, totalFinal,telefono]);

  return (
    <div className="carrito-container">
      <h2>Resumen de tu Carrito</h2>
      {cartItems.length === 0 ? (
        <p>No tienes productos agregados.</p>
      ) : (
        <>
          <ul className="carrito-lista">
            {cartItems.map((item) => {
              const tieneDescuento = item.discount && item.discount > 0;
              const precioConDescuento = tieneDescuento
                ? item.price - (item.price * item.discount) / 100
                : item.price;

              return (
                <li key={item._id} className="carrito-item">
                  <img src={item.image} alt={item.name} />
                  <div className="item-info">
                    <span>{item.name} de {item.proveedor}</span>
                    <span>
                      {item.quantity} x ${formatNumber(precioConDescuento)}
                      {tieneDescuento && (
                        <small style={{ color: "green" }}>(-{item.discount}%)</small>
                      )}
                    </span>
                  </div>
                  <button onClick={() => handleRemove(item._id)}>Eliminar</button>
                </li>
              );
            })}
          </ul>

          <div className="resumen-compra">
            <p>Subtotal: ${formatNumber(totalProductos)}</p>
            <p>Envío: ${formatNumber(envio)}</p>
            <h3>Total: ${formatNumber(totalFinal)}</h3>
          </div>

          {/* Formulario para dirección y documento */}
          <div className="formulario-compra">
            <div>
              <label>Dirección de Envío:</label>
              <input
                type="text"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                placeholder="Ingresa tu dirección"
              />
            </div>
            <div>
              <label>Documento:</label>
              <input
                type="text"
                value={documento}
                onChange={(e) => setDocumento(e.target.value)}
                placeholder="Ingresa tu documento"
              />
            </div>
            <div>
              <label>Telefono:</label>
              <input
                type="text"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="Ingresa nro de tu Celular"
              />
            </div>
          </div>

          <button onClick={handleMercadoPago}>Pagar con Mercado Pago</button>
        </>
      )}
    </div>
  );
}
