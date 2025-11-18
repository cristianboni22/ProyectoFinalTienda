// frontend/jest.setup.js

// Importamos TextEncoder y TextDecoder del módulo 'util' de Node.js
// La dependencia 'util' debe estar disponible en Node.js, donde Jest se ejecuta.
const { TextEncoder, TextDecoder } = require('util');

// Si TextEncoder no está definido globalmente (común en ambientes JSDOM antiguos), lo definimos.
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}

// ... (Aquí debajo va tu mock de import.meta, si lo necesitas)
/*
global.import = {
  meta: {
    env: {
      VITE_API_URL: 'http://localhost:8000', 
    },
  },
};
*/