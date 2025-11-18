// Este archivo simula la variable import.meta para que Jest no falle
global.import = {
  meta: {
    env: {
      VITE_API_URL: 'http://localhost:8000', // Valor mockeado para las pruebas
      // Puedes añadir otras variables de entorno que necesites aquí
    },
  },
};