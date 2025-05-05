import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import "../../styles/CargarProducto.css";

const initialForm = {
  name: "",
  price: "",
  image: "",
  quantity: "",
  discount: "",
  category: "",
  proveedor: "",
  oferta: "",
};

const CargarProducto = () => {
  const [products, setProducts] = useState([]);
  const [productosProveedor, setProductosProveedor] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [isEditing, setIsEditing] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [proveedores, setProveedores] = useState([]);
  const [selectedProveedor, setSelectedProveedor] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const nameInputRef = useRef(null);

  useEffect(() => {
    fetchProducts();
    fetchProveedores();
  }, []);

  useEffect(() => {
    const fetchProductosProveedor = async () => {
      if (!selectedProveedor || !selectedProveedor.nombreEmpresa) return;

      const nombreColeccion =
        "compra" + selectedProveedor.nombreEmpresa.replace(/\s/g, "");
      try {
        const res = await fetch(
          `https://la-tienda-backend.vercel.app/api/compra/proveedor/${nombreColeccion}`
        );
        const data = await res.json();
        setProductosProveedor(data);
      } catch (err) {
        console.error("Error al cargar productos del proveedor:", err);
      }
    };

    fetchProductosProveedor();
  }, [selectedProveedor]);

  useEffect(() => {
    const storedProveedor = JSON.parse(localStorage.getItem("proveedor"));
    if (storedProveedor) {
      setSelectedProveedor(storedProveedor);
      setForm((prev) => ({
        ...prev,
        proveedor: storedProveedor.nombreEmpresa,
      }));
    }
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("https://la-tienda-backend.vercel.app/api/products");
      const data = await res.json();
      const formatted = data.map((p) => ({
        ...p,
        price: formatNumberWithDots(p.price),
      }));
      setProducts(formatted);
    } catch (err) {
      Swal.fire("Error", "No se pudo obtener la lista de productos", "error");
    }
  };

  const fetchProveedores = async () => {
    try {
      const res = await fetch("https://la-tienda-backend.vercel.app/api/proveedor");
      const data = await res.json();
      setProveedores(data);

      if (isEditing && form.proveedor) {
        const proveedor = data.find((p) => p._id === form.proveedor);
        setSelectedProveedor(proveedor);
      }
    } catch (err) {
      Swal.fire("Error", "No se pudo obtener la lista de proveedores", "error");
    }
  };

  const formatNumberWithDots = (value) => {
    if (!value) return "";
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const cleanDots = (value) => value.replace(/\./g, "");

  const handleChange = (e) => {
    let value = e.target.value;
    const name = e.target.name;

    if (name === "price") {
      value = cleanDots(value);
      if (!/^\d*$/.test(value)) return;
      value = formatNumberWithDots(value);
    }

    setForm({ ...form, [name]: value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("https://la-tienda-backend.vercel.app/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Error al subir imagen");

      const data = await res.json();
      const imageUrl = data.url;

      setForm({ ...form, image: imageUrl });
      setPreviewImage(imageUrl);
    } catch (err) {
      Swal.fire("Error", "No se pudo subir la imagen", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing
      ? `https://la-tienda-backend.vercel.app/api/products/${form._id}`
      : "https://la-tienda-backend.vercel.app/api/products";

    const formToSend = {
      ...form,
      price: cleanDots(form.price),
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formToSend),
      });

      if (!res.ok) throw new Error("Error en la petición");

      Swal.fire(
        "Éxito",
        isEditing
          ? "Producto actualizado correctamente"
          : "Producto cargado correctamente",
        "success"
      );

      setForm(initialForm);
      setIsEditing(false);
      setSelectedProveedor(null);
      fetchProducts();
    } catch (err) {
      Swal.fire("Error", "Ocurrió un problema al guardar el producto", "error");
    }
  };

  const handleEdit = (product) => {
    const formattedProduct = {
      ...product,
      price: formatNumberWithDots(cleanDots(product.price.toString())),
      _id: product._id,
    };
    setForm(formattedProduct);
    setIsEditing(true);
    const proveedor = proveedores.find((p) => p._id === product.proveedor);
    setSelectedProveedor(proveedor);

    setTimeout(() => {
      nameInputRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      nameInputRef.current?.focus();
    }, 100);
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esto",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch(`https://la-tienda-backend.vercel.app/api/products/${id}`, {
          method: "DELETE",
        });

        if (!res.ok) throw new Error("Error al eliminar");

        Swal.fire("Eliminado", "El producto ha sido eliminado", "success");
        fetchProducts();
      } catch (err) {
        Swal.fire("Error", "No se pudo eliminar el producto", "error");
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) {
      Swal.fire("Advertencia", "No se ha seleccionado ningún producto", "warning");
      return;
    }

    const confirm = await Swal.fire({
      title: "¿Estás seguro?",
      text: `Se eliminarán ${selectedProducts.length} productos`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch("https://la-tienda-backend.vercel.app/api/products/bulk-delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: selectedProducts }),
        });

        if (!res.ok) throw new Error("Error al eliminar productos");

        Swal.fire("Eliminado", "Los productos seleccionados han sido eliminados", "success");
        fetchProducts();
        setSelectedProducts([]);
      } catch (err) {
        Swal.fire("Error", "No se pudieron eliminar los productos", "error");
      }
    }
  };

  const handleSelectProduct = (productId) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(productId)
        ? prevSelected.filter((id) => id !== productId)
        : [...prevSelected, productId]
    );
  };

  return (
    <div className="product-panel">
      <h2>{isEditing ? "Editar Producto" : "Agregar Producto"}</h2>
      <form onSubmit={handleSubmit} className="product-form">
        <div className="proveedor-select">
          <label>Proveedor</label>
          <select
            onChange={(e) => {
              const selected = proveedores.find(
                (p) => p._id === e.target.value
              );
              setSelectedProveedor(selected);
              setForm({ ...form, proveedor: selected.nombreEmpresa });
            }}
            value={form.proveedor || ""}
          >
            <option value="" disabled>
              Seleccioná un proveedor
            </option>
            {proveedores.map((prov) => (
              <option key={prov._id} value={prov._id}>
                {prov.nombreEmpresa}
              </option>
            ))}
          </select>
          {selectedProveedor && (
            <p className="label-proveedor">
              Empresa seleccionada:{" "}
              <strong>{selectedProveedor.nombreEmpresa}</strong>
            </p>
          )}
          <div className="oferta-select">
            <label>¿Está en oferta?</label>
            <select name="oferta" value={form.oferta} onChange={handleChange}>
              <option value="">Seleccioná</option>
              <option value="Sí">Sí</option>
              <option value="No">No</option>
            </select>
          </div>
        </div>

        {Object.keys(initialForm).map((field) =>
          field === "image" ? (
            <div key={field}>
              <label>Imagen (URL o Archivo)</label>
              <input
                type="text"
                name="image"
                value={form.image}
                placeholder="Pegar URL de la imagen"
                onChange={handleChange}
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
              {form.image && (
                <img
                  src={form.image}
                  alt="Preview"
                  style={{ maxHeight: "150px", marginTop: "10px" }}
                />
              )}
            </div>
          ) : (
            <input
              key={field}
              type="text"
              name={field}
              value={form[field] ?? ""}
              placeholder={field.toUpperCase()}
              onChange={handleChange}
              ref={field === "name" ? nameInputRef : null}
            />
          )
        )}

        <button type="submit">
          {isEditing ? "Guardar Cambios" : "Agregar"}
        </button>
      </form>

      <h2>Productos</h2>
      <div className="product-list">
        {products.map((prod) => (
          <div className="product-card" key={prod._id}>
            {prod.oferta === "Sí" && (
              <span className="offer-label">¡OFERTA!</span>
            )}
            <br></br>
            <input
              type="checkbox"
              checked={selectedProducts.includes(prod._id)}
              onChange={() => handleSelectProduct(prod._id)}
            />
            <img src={prod.image} alt={prod.name} />
            <h3>{prod.name}</h3>
            <p>Precio: ${prod.price}</p>
            <p>Cantidad: {prod.quantity}</p>
            <p>Descuento: {prod.discount}%</p>
            <p>Categoría: {prod.category}</p>
            <p>
              Proveedor:{" "}
              {proveedores.find((p) => p.nombreEmpresa === prod.proveedor)
                ?.nombreEmpresa || "Desconocido"}
            </p>
            <div className="product-buttons">
              <button className="btn-edit" onClick={() => handleEdit(prod)}>
                Editar
              </button>
              <button
                className="btn-delete"
                onClick={() => handleDelete(prod._id)}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      <button onClick={handleBulkDelete} className="btn-bulk-delete">
        Eliminar Productos Seleccionados
      </button>

      <h2>Productos de la colección del proveedor</h2>
      <div className="product-list">
        {productosProveedor.map((prod) => (
          <div className="product-card" key={prod._id}>
            <img src={prod.imagen} alt={prod.name} />
            <h3>{prod.nombreEmpresa}</h3>
            <p>Precio: ${formatNumberWithDots(prod.proveedor)}</p>
            <p>
              Proveedor:{" "}
              {proveedores.find((p) => p._id === prod.proveedor)
                ?.nombreEmpresa || "Desconocido"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CargarProducto;
