import React from "react";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";
import "../styles/Footer.css";
import qrDataFiscal from "../assets/qr-data-fiscal.png"; // Asegúrate de tener esta imagen

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-right">
          <h2 style={{color:"white"}}>Redes Sociales</h2>
          <hr></hr>
          <br></br>
        
          <a
            href="https://instagram.com/tu_tienda"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram size={24} />
          </a>
          <a
            href="https://wa.me/34654000000"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp size={24} />
          </a>
        </div>
        <div className="footer-left">
          <p>© 2025 Tienda para vender - Todos los derechos reservados.</p>
          <div className="footer-links">
            <a href="/condiciones">Condiciones de uso</a>
            <span>·</span>
            <a href="/privacidad">Política de privacidad</a>
          </div>
        </div>

        <div className="footer-center">
          <img src={qrDataFiscal} alt="QR Data Fiscal" className="qr-image" />
          <p>Data Fiscal</p>
        </div>
      </div>
    </footer>
  );
}
