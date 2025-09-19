import { Link } from "react-router-dom";

function ProductCard({ product }) {
  return (
    <div className="card m-2" style={{ width: "18rem" }}>
      <img src={product.imagen} className="card-img-top" alt={product.nombre} />
      <div className="card-body">
        <h5 className="card-title">{product.nombre}</h5>
        <p className="card-text">${product.precio}</p>
        <Link to={`/product/${product.id}`} className="btn btn-primary w-100">
          Ver producto
        </Link>
      </div>
    </div>
  );
}

export default ProductCard;
