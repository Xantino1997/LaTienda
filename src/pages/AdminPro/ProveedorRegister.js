import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Auth.css";

export default function ProveedorRegister() {
  const [nombreEmpresa, setEmpresa] = useState("");
  const [precio, setPrecio] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imagen, setImagen] = useState(null);
  const [numeroFiscal, setNumeroFiscal] = useState("");
  const [contacto, setContacto] = useState("");
  const [correoRecuperacion, setCorreoRecuperacion] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append("nombreEmpresa", nombreEmpresa);
    formData.append("precio", precio);
    formData.append("numeroFiscal", numeroFiscal);
    formData.append("contacto", contacto);
    formData.append("correoRecuperacion", correoRecuperacion);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("role", "proveedor");  // Asegúrate de enviar el role explícitamente si lo deseas
    if (imagen) {
      formData.append("imagen", imagen);
    }
  
    try {
      const res = await fetch("http://localhost:5000/api/proveedor/registrar", {
        method: "POST",
        body: formData,
      });
  
      if (res.ok) {
        alert("Registro exitoso");
        navigate("/login");
      } else {
        const err = await res.json();
        alert("Error: " + err.mensaje);
      }
    } catch (err) {
      console.error(err);
      alert("Error al registrar proveedor");
    }
  };
  

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit} encType="multipart/form-data">
        <h2>Registro de Proveedor</h2>

        <label>Nombre de la Empresa</label>
        <input type="text" required value={nombreEmpresa} onChange={(e) => setEmpresa(e.target.value)} />

        <label>Precio</label>
        <input type="number" required value={precio} onChange={(e) => setPrecio(e.target.value)} />

        <label>Email</label>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />

        <label>Contraseña</label>
        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />

        <label>Imagen</label>
        <input type="file" accept="image/*" onChange={(e) => setImagen(e.target.files[0])} />

        <label>Número Fiscal</label>
        <input type="text" required value={numeroFiscal} onChange={(e) => setNumeroFiscal(e.target.value)} />

        <label>Contacto (opcional)</label>
        <input type="text" value={contacto} onChange={(e) => setContacto(e.target.value)} />

        <label>Correo de Recuperación</label>
        <input type="email" value={correoRecuperacion} onChange={(e) => setCorreoRecuperacion(e.target.value)} />

        <button type="submit" className="auth-button">Confirmar Registro</button>
      </form>
    </div>
  );
}
