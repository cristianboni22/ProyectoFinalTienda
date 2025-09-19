import { useParams } from "react-router-dom";

function ProductDetail() {
  const { id } = useParams();

  return (
    <div className="container mt-4">
      <h1>Detalle del Producto {id}</h1>
      <p>Aquí irá la información del producto desde tu backend.</p>
    </div>
  );
}

export default ProductDetail;
