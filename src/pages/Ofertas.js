import React, { useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";
import "../styles/Ofertas.css";
import { FaShareAlt } from "react-icons/fa";
import { CartContext } from "../context/CartContext"; // Importa el CartContext

const handleShare = (product) => {
  const name = product.name;
  const price = product.price.toLocaleString("es-AR");
  const image =
    "https://hips.hearstapps.com/hmg-prod/images/gettyimages-1322478750-6784d1c1dee88.jpg?crop=0.667xw:1.00xh;0.105xw,0&resize=640:*";

  const instagramUrl = "https://www.instagram.com"; // Reemplázalo por el real

  const message = `🛍️ Mirá este artículo que encontré en lo de Majo:\n\n📦 ${name}\n💲 $${price}\n📷 ${image}\n\n📲 Encontralo en nuestro Instagram: ${instagramUrl}`;

  if (navigator.share) {
    navigator
      .share({
        title: `Lo de Majo - ${name}`,
        text: message, // SOLO texto para evitar que lo reemplace con el URL
      })
      .catch((error) => console.error("Error al compartir:", error));
  } else {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  }
};

const Ofertas = () => {
  const { addToCart } = useContext(CartContext); // Consume el contexto de carrito
  const [products, setProducts] = useState([]);

  // Obtiene productos de la API
  useEffect(() => {
    fetch("https://la-tienda-backend.vercel.app/api/products")
      .then((res) => res.json())
      .then((data) => {
        const ofertas = data.filter((p) => p.oferta === "Sí");
        setProducts(ofertas);
      })
      .catch((err) => console.error("Error al obtener productos en oferta:", err));
  }, []);

  const getDiscountedPrice = (price, discount) => {
    return discount > 0 && discount <= 50 ? price - (price * discount) / 100 : price;
  };

  const handleAddToCart = (product) => {
    addToCart(product); // Agrega el producto al carrito utilizando el contexto
    Swal.fire({
      title: "¡Producto agregado!",
      text: `${product.name} fue agregado al carrito.`,
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
    });
  };

  return (
    <section className="ofertas-section">
      <h2>Ofertas Exclusivas</h2>
      <div className="ofertas-list">
        {products.map((product) => {
          const finalPrice = getDiscountedPrice(product.price, product.discount);
          return (
            <div className="oferta-card" key={product._id}>
              {product.oferta === "Sí" && <span className="oferta-label">¡OFERTA!</span>}
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              {product.discount > 0 ? (
                <p>
                  <span className="old-price">${product.price.toLocaleString("es-AR")}</span>
                  <span className="new-price">${finalPrice.toLocaleString("es-AR")}</span>
                  <span className="discount-label">-{product.discount}% Off</span>
                </p>
              ) : (
                <p>${product.price.toLocaleString("es-AR")}</p>
              )}
              <button className="oferta-button" onClick={() => handleAddToCart(product)}>
                Agregar al carrito
              </button>
              <button className="share-button" onClick={() => handleShare(product)}>
                <FaShareAlt style={{ marginRight: "6px" }} /> Compartir
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Ofertas;
