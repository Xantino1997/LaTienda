import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function ProVenta() {
  const { user } = useContext(AuthContext);
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Usuario logueado:", user); // 👈 Log para ver el usuario

    const fetchCompras = async () => {
      if (!user || !user.userId || user.role !== "proveedor") return;

      try {
        const res = await fetch(`http://localhost:5000/api/compra`);
        const data = await res.json();

        console.log("Datos traídos del backend:", data); // 👈 Log para ver las compras

        if (res.ok) {
          setCompras(data);
        } else {
          console.error("Error al traer compras:", data.message);
        }
      } catch (err) {
        console.error("Error en el fetch:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompras();
  }, [user]);

  if (loading) return <p>Cargando ventas...</p>;

  return (
    <div>
      <h2>Mis Ventas</h2>
      {compras.length === 0 ? (
        <p>No hay ventas registradas.</p>
      ) : (
        <ul>
          {compras.map((compra) => (
            <li key={compra._id}>
              <h3>Compra: {compra._id}</h3>
              <ul>
                {compra.productos.map((producto, index) => (
                  <li key={index}>
                    <strong>{producto.name}</strong> - {producto.price} USD
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
