import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Productos from "./pages/Productos";
import Nosotros from "./pages/Nosotros";
import Contacto from "./pages/Contacto";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/productos" element={<Productos  />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/contacto" element={<Contacto />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
