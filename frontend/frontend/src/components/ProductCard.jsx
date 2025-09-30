import React from "react";

function ProductCard({ product }) {
  return (
    <div className="card shadow-sm h-100">
      {product.imagenes && product.imagenes.length > 0 ? (
        <div id={`carousel-${product.id}`} className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner" style={{ height: "200px", backgroundColor: "#f8f9fa" }}>
            {product.imagenes.map((img, idx) => (
              <div key={idx} className={`carousel-item ${idx === 0 ? "active" : ""}`}>
                <img
                  src={img.url_imagen}
                  className="d-block w-100"
                  alt={`${product.nombre} ${idx + 1}`}
                  style={{ height: "200px", objectFit: "contain" }}
                />
              </div>
            ))}
          </div>
          {product.imagenes.length > 1 && (
            <>
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target={`#carousel-${product.id}`}
                data-bs-slide="prev"
              >
                <span className="carousel-control-prev-icon" style={{ filter: "invert(1)" }}></span>
                <span className="visually-hidden">Anterior</span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target={`#carousel-${product.id}`}
                data-bs-slide="next"
              >
                <span className="carousel-control-next-icon" style={{ filter: "invert(1)" }}></span>
                <span className="visually-hidden">Siguiente</span>
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="d-flex align-items-center justify-content-center bg-light" style={{ height: "200px" }}>
          <span className="text-muted">Sin imagen</span>
        </div>
      )}

      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{product.nombre}</h5>
        <p className="card-text text-muted flex-grow-1">{product.descripcion}</p>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="fw-bold text-success">💲 {product.precio}</span>
          <small className="text-muted">Stock: {product.stock}</small>
        </div>
        <a href={`/producto/${product.id}`} className="btn btn-dark w-100">
          Comprar
        </a>
      </div>
    </div>
  );
}

export default ProductCard;
