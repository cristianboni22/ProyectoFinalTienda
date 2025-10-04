import React, { useState, useContext } from "react";
import { CartContext } from "../context/CartContext";

function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);
  const [cantidad, setCantidad] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(product.variantes?.[0] || null);

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, cantidad);
    setCantidad(1); // reset input
  };

  return (
    <div className="card shadow-sm h-100">
      <img
        src={product.imagenes?.[0]?.url_imagen || '/placeholder.png'}
        alt={product.nombre}
        className="card-img-top"
        style={{ height: '200px', objectFit: 'contain' }}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{product.nombre}</h5>
        <p className="card-text flex-grow-1 text-muted">{product.descripcion}</p>

        {product.variantes?.length > 0 && (
          <select
            className="form-select mb-2"
            value={selectedVariant?.id || ''}
            onChange={e => {
              const variant = product.variantes.find(v => v.id === parseInt(e.target.value));
              setSelectedVariant(variant);
            }}
          >
            {product.variantes.map(v => (
              <option key={v.id} value={v.id}>
                Talla: {v.talla}, Color: {v.color} (Stock: {v.stock_individual})
              </option>
            ))}
          </select>
        )}

        <div className="d-flex gap-2 align-items-center mb-2">
          <input
            type="number"
            min="1"
            max={selectedVariant?.stock_individual || product.stock}
            value={cantidad}
            className="form-control"
            style={{ width: '70px' }}
            onChange={e => setCantidad(parseInt(e.target.value))}
          />
          <button className="btn btn-dark flex-grow-1" onClick={handleAddToCart}>
            Añadir al carrito
          </button>
        </div>

        <span className="fw-bold text-success">€{product.precio}</span>
      </div>
    </div>
  );
}

export default ProductCard;
