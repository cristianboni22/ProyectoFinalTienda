// frontend/jest.setup.js

// 1. Polyfill para TextEncoder (resuelve el problema anterior con react-router)
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// 2. Mock para import.meta (resuelve el problema actual con Vite)
global.import = {
  meta: {
    env: {
      VITE_API_URL: 'http://localhost:8000', 
    },
  },
};