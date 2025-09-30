import { Link } from 'react-router-dom';
import { FaCartPlus } from 'react-icons/fa';

function ProductCard({ product }) {
  return (
    <div className="col-md-4 mb-4">
      <div className="card h-100">
        <img src={product.imagen} className="card-img-top" alt={product.nombre} />
        <div className="card-body">
          <h5 className="card-title">{product.nombre}</h5>
          <p className="card-text">{product.descripcion}</p>
          <h6>${product.precio}</h6>
          <Link to={`/producto/${product.id}`} className="btn btn-primary me-2">Ver más</Link>
          <button className="btn btn-success">
            <FaCartPlus /> Agregar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;