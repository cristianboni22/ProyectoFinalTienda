import { useEffect, useState } from "react";
import productService from "../services/productService";

function Productos() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const data = await productService.getAll();
      console.log("Productos desde backend:", data);
      setProductos(data);
    } catch (error) {
      console.error("Error cargando productos:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">✨ Nuestros Productos ✨</h1>

      {productos.length === 0 ? (
        <p className="text-gray-600 text-center">No hay productos disponibles.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productos.map((p) => (
            <div
              key={p.id}
              className="bg-white border rounded-2xl shadow-md hover:shadow-lg transition p-4 flex flex-col"
            >
              {/* Imagen del producto */}
              <div className="h-48 w-full mb-4 flex items-center justify-center overflow-hidden rounded-xl bg-gray-50">
                {p.imagenes && p.imagenes.length > 0 ? (
                  <img
                    src={p.imagenes[0].url_imagen} // <-- tomamos la primera imagen
                    alt={p.nombre}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400">Sin imagen</span>
                )}
              </div>

              {/* Info del producto */}
              <h2 className="text-lg font-semibold mb-1">{p.nombre}</h2>
              <p className="text-sm text-gray-600 flex-grow">{p.descripcion}</p>

              {/* Precio y stock */}
              <div className="mt-3 flex justify-between items-center">
                <span className="text-xl font-bold text-green-600">
                  💲 {p.precio}
                </span>
                <span className="text-sm text-gray-500">Stock: {p.stock}</span>
              </div>

              {/* Botón simulado */}
              <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl transition">
                Añadir al carrito 🛒
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Productos;
