import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../styles/HomePage.css";
import Modelo from "../assets/invierno.png";
import Bg1 from "../assets/oton.png";
import Bg2 from "../assets/primavera.png";
import Bg3 from "../assets/primavera1.png";
import { FaShareAlt } from "react-icons/fa";
import { CartContext } from "../context/CartContext";

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
        text: message, 
      })
      .catch((error) => console.error("Error al compartir:", error));
  } else {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  }
};

const HomePage = () => {
  const { addToCart } = useContext(CartContext);
  const backgrounds = [Bg1, Bg2, Bg3];
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prevIndex) => (prevIndex + 1) % backgrounds.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchProducts = () => {
    fetch("https://la-tienda-backend.vercel.app/api/products")
      .then((res) => res.json())
      .then((data) => {
        // Ordenamos por fecha más reciente
        const sorted = data
          .filter((p) => p.createdAt)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setProducts(sorted.slice(0, 4));
      })
      .catch((err) => console.error("Error al obtener productos:", err));
  };

  useEffect(() => {
    fetchProducts();

    // Refresca los productos cada 24 horas (86.400.000 ms)
    const interval = setInterval(fetchProducts, 86400000);
    return () => clearInterval(interval);
  }, []);

  const getDiscountedPrice = (price, discount) => {
    return discount > 0 && discount <= 50
      ? price - (price * discount) / 100
      : price;
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    Swal.fire({
      title: "¡Producto agregado!",
      text: `${product.name} fue agregado al carrito.`,
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
    });
  };

  return (
    <div className="homepage">
      <section
        className="hero"
        style={{ backgroundImage: `url(${backgrounds[currentBgIndex]})` }}
      >
        <div className="hero-content">
          <h1 className="fade-in-left">
            COMPRA
            <br /> SIN PREOCUPACIONES
          </h1>
          <a href="#productos" className="btn-explore scroll-arrow">
            <span className="scroll-text">explorar</span>
            <span className="scroll-icon">↓</span>
          </a>
        </div>
      </section>

      <section className="products" id="productos">
        <h2>Productos Destacados</h2>

        <div className="product-list">
          {products.map((product) => {
            const finalPrice = getDiscountedPrice(
              product.price,
              product.discount
            );

            return (
              <div className="product-card" key={product._id}>
                {product.oferta === "Sí" && (
                  <span className="offer-label">¡OFERTA!</span>
                )}
                <br></br>
                <br></br>
                <img src={product.image} alt={product.name} />
                <h3>{product.name}</h3>
                {product.discount > 0 && product.discount <= 50 ? (
                  <p>
                    <span className="old-price">
                      ${product.price.toLocaleString("es-AR")}
                    </span>{" "}
                    <span className="new-price">
                      ${finalPrice.toLocaleString("es-AR")}
                    </span>
                    <span className="discount-label">
                      -{product.discount}% Off
                    </span>
                  </p>
                ) : (
                  <p>${product.price.toLocaleString("es-AR")}</p>
                )}
                <button
                  className="product-card-button"
                  onClick={() => handleAddToCart(product)}
                >
                  Agregar al carrito
                </button>
                <button
                  className="share-button"
                  onClick={() => handleShare(product)}
                  title="Compartir"
                >
                  <FaShareAlt size={18} style={{ marginRight: "6px" }} />
                  Compartir
                </button>
              </div>
            );
          })}
        </div>
      </section>

      <section className="offers">
        <h2>Ofertas</h2>
        <div className="offer-banner">
          <img src={Modelo} alt="Modelo" />
          <div className="offer-text">
            <Link to="/ofertas">
              <h3>
                HASTA 30 %<br />
                DE DESCUENTO
              </h3>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
