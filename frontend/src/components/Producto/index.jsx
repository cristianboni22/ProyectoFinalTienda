import React, { useEffect, useState } from "react";

function ProductList() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/productos") // Ajusta el endpoint si es necesario
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch((err) => console.error("Error al obtener productos:", err));
  }, []);

  return (
    <div>
      <h2>Productos</h2>
      <ul>
        {productos.map((producto) => (
          <li key={producto.id}>
            <strong>{producto.nombre}</strong> - {producto.descripcion}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductList;
