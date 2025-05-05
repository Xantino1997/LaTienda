import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/ClienteRegister.css";

export default function ClienteRegister() {
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [dni, setDni] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [telefono, setTelefono] = useState("");
  const [imagen, setImagen] = useState(null);
  const [gustos, setGustos] = useState([]);
  const [correoRecuperacion, setCorreoRecuperacion] = useState("");
  const navigate = useNavigate();

  const opcionesGustos = [
    "Tecnología",
    "Deportes",
    "Bazar",
    "Moda",
    "Cocina",
    "Mascotas",
  ];

  const handleGustosChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setGustos([...gustos, value]);
    } else {
      setGustos(gustos.filter((g) => g !== value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nombreCompleto", nombreCompleto);
    formData.append("dni", dni);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("telefono", telefono);
    formData.append("role", "cliente");
    formData.append("correoRecuperacion", correoRecuperacion);
    if (imagen) formData.append("imagen", imagen);
    gustos.forEach((gusto) => formData.append("gustos[]", gusto));

    try {
      const res = await fetch("https://la-tienda-backend.vercel.app/api/cliente/registrar", {
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
      alert("Error al registrar cliente");
    }
  };

  return (
    <div className="auth-container">
      <form
        className="auth-form"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <h2>Registro de Cliente</h2>

        <label>Nombre Completo</label>
        <input
          type="text"
          required
          value={nombreCompleto}
          onChange={(e) => setNombreCompleto(e.target.value)}
        />

        <label>DNI</label>
        <input
          type="text"
          required
          value={dni}
          onChange={(e) => setDni(e.target.value)}
        />

        <label>Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Contraseña</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label>Imagen</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImagen(e.target.files[0])}
        />

        <label>Correo de Recuperación</label>
        <input
          type="email"
          value={correoRecuperacion}
          onChange={(e) => setCorreoRecuperacion(e.target.value)}
        />
        <label>Telefono</label>
        <input
          type="telefono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
        />

        <label>Gustos</label>
        <div className="gustos-checkboxes">
          {opcionesGustos.map((gusto) => (
            <label key={gusto}>
              <input
                type="checkbox"
                value={gusto}
                checked={gustos.includes(gusto)}
                onChange={handleGustosChange}
              />
              {gusto}
            </label>
          ))}
        </div>

        <button type="submit" className="auth-button">
          Confirmar Registro
        </button>
      </form>
    </div>
  );
}
