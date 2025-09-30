import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getUserOrders } from '../services/api';

function Profile() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user) {
      getUserOrders(user.id).then(setOrders);
    }
  }, [user]);

  return (
    <div>
      <h2>Perfil de Usuario</h2>
      <p>Email: {user?.email}</p>
      <h3>Historial de Pedidos</h3>
      <ul>
        {orders.map(order => (
          <li key={order.id}>Pedido #{order.id} - Total: ${order.total}</li>
        ))}
      </ul>
    </div>
  );
}

export default Profile;