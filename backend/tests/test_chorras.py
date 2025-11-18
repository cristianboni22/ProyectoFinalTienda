# tests/test_chorras.py
import unittest
from app.schemas.usuario import UsuarioCreate, UsuarioOut
from app.schemas.producto import ProductoCreate, ProductoOut
from app.routes.usuario import hash_password
from fastapi.testclient import TestClient
from passlib.context import CryptContext
from app.main import app  # Asegúrate de que tu FastAPI app se llame 'app' en main.py

class TestSchemas(unittest.TestCase):
    
    def test_usuario_create(self):
        usuario = UsuarioCreate(
            nombre="Pepe",
            apellido="Perez",
            email="pepe@test.com",
            contrasena="1234",
            direccion="Calle Falsa 123",
            telefono="555-555"
        )
        self.assertEqual(usuario.nombre, "Pepe")
        self.assertEqual(usuario.email, "pepe@test.com")
    
    def test_usuario_out(self):
        usuario = UsuarioOut(
            id=1,
            nombre="Ana",
            apellido="Lopez",
            email="ana@test.com",
            rol="cliente"
        )
        self.assertEqual(usuario.id, 1)
        self.assertEqual(usuario.rol, "cliente")
    
    def test_producto_create(self):
        producto = ProductoCreate(
            nombre="Camiseta",
            descripcion="Camiseta azul",
            precio=10.5,
            stock=5,
            id_categoria=1,
            id_subcategoria=1
        )
        self.assertEqual(producto.nombre, "Camiseta")
        self.assertEqual(producto.precio, 10.5)

class TestFunciones(unittest.TestCase):
    
    def test_hash_password(self):
        pw = "1234"
        hashed = hash_password(pw)
        self.assertNotEqual(pw, hashed)
        self.assertTrue(hashed.startswith("$2b$"))

class TestFastAPIDummy(unittest.TestCase):
    
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def test_root_users(self):
        response = self.client.get("/usuarios/")  # Ajusta la ruta según tu router
        self.assertIn(response.status_code, [200, 404])  # Al menos que no falle

    def test_root_productos(self):
        response = self.client.get("/productos/")
        self.assertIn(response.status_code, [200, 404])

if __name__ == "__main__":
    unittest.main()
