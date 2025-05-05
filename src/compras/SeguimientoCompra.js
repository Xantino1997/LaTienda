import React, { useState, useRef } from "react";
import "../styles/SeguimientoCompras.css";
import html2canvas from "html2canvas"; // Acordate de instalarlo: npm install html2canvas

const SeguimientoCompra = () => {
  const [codigoSeguimiento, setCodigo] = useState("");
  const [compra, setCompra] = useState(null);
  const [error, setError] = useState("");
  const resultadoRef = useRef(null); // para capturar

  const formatoArgentino = (numero) => {
    if (typeof numero !== "number") return numero;
    return numero.toLocaleString("es-AR");
  };

  const buscarCompra = async () => {
    if (!codigoSeguimiento.trim()) {
      setError("Por favor ingresá un código de seguimiento.");
      setCompra(null);
      return;
    }

    try {
      const res = await fetch(
        `https://la-tienda-backend.vercel.app/api/compra/${codigoSeguimiento}`
      );
      if (!res.ok) throw new Error("Compra no encontrada.");

      const data = await res.json();
      setCompra(data);
      setError("");
    } catch (err) {
      setError(err.message);
      setCompra(null);
    }
  };

  const descargarCaptura = async () => {
    const createdAt = compra.createdAt;

    const fecha = new Date(createdAt);
    const fechaFormateada = `${fecha.getDate().toString().padStart(2, "0")}-${(
      fecha.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${fecha.getFullYear()}`;

      const proveedor = compra.productos[0]?.proveedor || "desconocido";



    const boton = document.getElementById("botonCaptura");
    boton.style.display = "none"; // ocultamos botón antes de la foto
    const canvas = await html2canvas(resultadoRef.current);
    const link = document.createElement("a");
    link.download = `Compra_${fechaFormateada}_EN_${proveedor.toUpperCase()}.png`;
    link.href = canvas.toDataURL();
    link.click();
    boton.style.display = "block"; // volvemos a mostrar botón
  };

  return (
    <div className="seguimiento-container">
      <h2>📦 Seguimiento de tu Compra</h2>
      <input
        type="text"
        value={codigoSeguimiento}
        onChange={(e) => setCodigo(e.target.value)}
        placeholder="Ingresá tu código de seguimiento"
      />
      <button onClick={buscarCompra}>Buscar</button>

      {error && <p className="error">{error}</p>}

      {compra && (
        <>
          <div className="resultado" ref={resultadoRef}>
            <h3 className="titulo-seccion">🛒 Detalles de tu compra</h3>
            <ul>
              {compra.productos.map((p, i) => (
                <li key={i}>
                  <li key={i}>
                    <strong>{p.nombre}</strong>
                    {`${p.quantity || p.cantidad} ${
                      p.quantity === 1 ? "unidad" : "unidades"
                    }`}
                  </li>
                  <h3
                    className="proveedor"
                    style={{ textAlign: "center", color: "blue" }}
                  >
                    Proveedor: {p.proveedor || "Desconocido"}
                  </h3>
                </li>
              ))}
            </ul>
            <p>
              <strong>Dirección:</strong> {compra.direccion}
            </p>
            <p>
              <strong>Documento:</strong> {compra.documento}
            </p>

            <h3
              className="proveedor"
              style={{ textAlign: "center", color: "red" }}
            >
              <strong>Total:</strong> ${formatoArgentino(compra.totalFinal)}
            </h3>
            <h3
              className="proveedor"
              style={{ textAlign: "center", color: "green" }}
            >
              <strong>Estado:</strong>
              {formatoArgentino(compra.estado)}
            </h3>
          </div>

          <button
            id="botonCaptura"
            onClick={descargarCaptura}
            className="boton-captura"
          >
            Descargar Captura 📷
          </button>
        </>
      )}
    </div>
  );
};

export default SeguimientoCompra;
