import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Checkout from './pages/Checkout';
import AdminPanel from './pages/AdminPanel';
import Nosotros from './pages/Nosotros';

function App() {
  return (
    <BrowserRouter>
      {/* Contenedor principal que ocupa toda la altura */}
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        
        {/* El contenido se expande y empuja el footer */}
        <main className="flex-fill">
          <div className="container mt-4 mb-5">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/productos" element={<Products />} />
              <Route path="/producto/:id" element={<ProductDetail />} />
              <Route path="/carrito" element={<Cart />} />
              <Route path="/nosotros" element={<Nosotros />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/perfil" element={<Profile />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/admin" element={<AdminPanel />} />
            </Routes>
          </div>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
