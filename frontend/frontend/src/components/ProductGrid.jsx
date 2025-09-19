import ProductCard from "./ProductCard";

const products = [
  { id: 1, nombre: "Zapatilla Runner", precio: 120, imagen: "/product1.jpg" },
  { id: 2, nombre: "Zapatilla Sport", precio: 90, imagen: "/product2.jpg" },
  { id: 3, nombre: "Zapatilla Casual", precio: 70, imagen: "/product3.jpg" },
];

function ProductGrid() {
  return (
    <div className="d-flex flex-wrap justify-content-center">
      {products.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}

export default ProductGrid;
