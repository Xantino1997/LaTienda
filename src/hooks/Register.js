import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Register.css";

export default function Register() {
  const [step, setStep] = useState(1);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("cliente"); // cliente o proveedor
  const [code, setCode] = useState("");
  const [serverCode, setServerCode] = useState(""); // opcional, si backend lo envía
  const navigate = useNavigate();

  // Paso 1: Enviar datos al backend
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      nombre,
      apellido,
      email,
      password,
      role,
    };

    try {
      const response = await fetch("https://la-tienda-backend.vercel.app/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Código enviado a:", email);
        setStep(2);

        // Si querés manejar el código que llega del backend
        // setServerCode(result.code);
      } else {
        alert(result.message || "Error en el registro");
      }
    } catch (error) {
      console.error("Error al registrar:", error);
      alert("No se pudo registrar. Intentalo más tarde.");
    }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("https://la-tienda-backend.vercel.app/api/auth/verify-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert("Cuenta verificada exitosamente");
  
        if (role === "proveedor") {
          navigate("/proveedor");
        } else {
          navigate("/cliente");
        }
      } else {
        alert(result.message || "Código incorrecto o expirado");
      }
    } catch (error) {
      console.error("Error al verificar código:", error);
      alert("No se pudo verificar. Intentalo más tarde.");
    }
  };
  

  return (
    <div className="auth-container">
      {step === 1 ? (
        <form className="auth-form" onSubmit={handleRegisterSubmit}>
          <h2>Registrate</h2>

          <label>Nombre</label>
          <input
            type="text"
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />

          <label>Apellido</label>
          <input
            type="text"
            required
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
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

          <label>Registrarse como</label>
          <div className="auth-radio-group">
            <label>
              <input
                type="radio"
                value="cliente"
                checked={role === "cliente"}
                onChange={() => setRole("cliente")}
              />
              Cliente
            </label>
            <label>
              <input
                type="radio"
                value="proveedor"
                checked={role === "proveedor"}
                onChange={() => setRole("proveedor")}
              />
              Proveedor
            </label>
          </div>

          <button type="submit" className="auth-button">Enviar Código</button>
          <div className="auth-links">
            <Link to="/login">¿Ya tenés cuenta? Iniciá sesión</Link>
          </div>
        </form>
      ) : (
        <form className="auth-form" onSubmit={handleCodeSubmit}>
          <h2>Confirmar Código</h2>
          <p>Revisá tu correo: {email}</p>
          <label>Código de confirmación</label>
          <input
            type="text"
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button type="submit" className="auth-button">Validar y Crear Cuenta</button>
        </form>
      )}
    </div>
  );
}
