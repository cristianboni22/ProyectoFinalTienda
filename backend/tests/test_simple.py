import unittest
from fastapi.testclient import TestClient
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database import init_engine, Base, get_db,engine

# Inicializar engine de testing
init_engine("sqlite:///:memory:")


TestingSessionLocal = sessionmaker(bind=engine)

# Sobrescribir get_db para tests
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

class TestSimple(unittest.TestCase):
    def test_root(self):
        response = client.get("/")
        self.assertIn(response.status_code, [200, 404])
