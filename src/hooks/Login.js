import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";
import "../styles/Auth.css";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imagen, setImagen] = useState("");
  const [proveedor, setProveedor] = useState("");
  const [showPass, setShowPass] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://la-tienda-backend.vercel.app/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password}),
      });

      const data = await res.json();

      if (res.ok) {
        const { role, userId, token } = data;

        // Guardamos al usuario en el contexto
        login({ email, role, userId, token,imagen,proveedor });

        Swal.fire({
          icon: "success",
          title: "¡Login exitoso!",
          showConfirmButton: false,
          timer: 1500,
        });

        setTimeout(() => {
          if (role === "admin") {
            navigate("/admin");
          } else if (role === "proveedor") {
            navigate(`/adminproveedor/${userId}`);
          } else if (role === "operador") {
            navigate("/operador");
          } else if (role === "cliente") {
            navigate(`/admincliente/${userId}`);
          } else {
            Swal.fire("Error", "Rol no reconocido", "warning");
          }
        }, 1600);
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: data.message || "Credenciales incorrectas",
        });
      }
    } catch (err) {
      console.error("Error en login:", err);
      Swal.fire("Error de conexión", "No se pudo contactar con el servidor", "error");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Iniciar Sesión</h2>

        <label>Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Contraseña</label>
        <div className="password-wrapper">
          <input
            type={showPass ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span onClick={() => setShowPass(!showPass)} className="eye-icon">
            {showPass ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button type="submit" className="auth-button">Ingresar</button>

        <div className="auth-links">
          <Link to="/registro">¿No tenés cuenta? Registrate</Link>
          <Link to="/recuperar">Olvidé mi contraseña</Link>
        </div>
      </form>
    </div>
  );
}
