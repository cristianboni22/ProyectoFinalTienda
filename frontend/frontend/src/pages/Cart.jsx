import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import CartItem from '../components/CartItem';
import { Link } from 'react-router-dom';

function Cart() {
  const { cart, removeFromCart, updateQuantity } = useContext(CartContext);

  const total = cart.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

  return (
    <div>
      <h2>Carrito de Compras</h2>
      {cart.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <>
          {cart.map(item => (
            <CartItem
              key={item.id}
              item={item}
              onRemove={() => removeFromCart(item.id)}
              onUpdateQuantity={updateQuantity}
            />
          ))}
          <h4 className="mt-3">Total: ${total}</h4>
          <Link to="/checkout" className="btn btn-primary mt-2">Ir a pagar</Link>
        </>
      )}
    </div>
  );
}

export default Cart;