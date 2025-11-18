// frontend/jest.setup.js
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.import = {
  meta: {
    env: {
      VITE_API_URL: 'http://localhost:8000', 
    },
  },
};