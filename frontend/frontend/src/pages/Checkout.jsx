import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

function Checkout() {
  const { cart } = useContext(CartContext);

  const handlePay = () => {
    // Aquí iría la lógica para procesar el pago con el backend
    alert('Pago realizado con éxito!');
  };

  return (
    <div>
      <h2>Checkout</h2>
      <ul>
        {cart.map(item => (
          <li key={item.id}>{item.nombre} x {item.cantidad} - ${item.precio * item.cantidad}</li>
        ))}
      </ul>
      <button className="btn btn-success" onClick={handlePay}>Pagar</button>
    </div>
  );
}

export default Checkout;