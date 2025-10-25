import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: [
      'all', // Permite cualquier dominio
      'mitiendaproyecto.zapto.org', // Tu dominio específico
      '*'
    ]
  }
})