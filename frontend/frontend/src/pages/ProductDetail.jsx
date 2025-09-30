import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getProductDetail } from '../services/api';
import { FaCartPlus } from 'react-icons/fa';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    getProductDetail(id).then(setProduct);
  }, [id]);

  if (!product) return <div>Cargando...</div>;

  return (
    <div className="row">
      <div className="col-md-6">
        <img src={product.imagen} alt={product.nombre} className="img-fluid" />
      </div>
      <div className="col-md-6">
        <h2>{product.nombre}</h2>
        <p>{product.descripcion}</p>
        <h4>${product.precio}</h4>
        <button className="btn btn-success">
          <FaCartPlus /> Agregar al carrito
        </button>
      </div>
    </div>
  );
}

export default ProductDetail;