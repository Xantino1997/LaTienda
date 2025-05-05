import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LogoSplash.css";

const LogoSplash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/home"); // Cambiá esto por la ruta de destino
    }, 5000);

    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div className="splash-container">
      <div className="logo-grid">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className={`logo-piece piece-${i}`}></div>
        ))}
      </div>
    </div>
  );
};

export default LogoSplash;
