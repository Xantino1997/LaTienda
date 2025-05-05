// --- OperadorCard.jsx ---
import React from "react";
import "../styles/Card.css";

export default function OperadorCard({ operador }) {
  return (
    <div className="card">
      <img src={operador.foto || "/default-avatar.png"} alt={operador.nombre} />
      <div className="card-body">
        <h4>{operador.nombre}</h4>
        <p>{operador.online ? "🟢 En línea" : "🔴 Desconectado"}</p>
        <button>Chat</button>
      </div>
    </div>
  );
}