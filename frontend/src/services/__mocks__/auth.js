// Este archivo simula src/services/auth.js para Jest.

// Usamos process.env, que es compatible con Jest/Node.
// El valor por defecto 'http://localhost:8000' es de seguridad.
const API_URL = `${process.env.VITE_API_URL || "http://localhost:8000"}/auth`;

// Mockear las funciones que se usan
export const registerUser = (userData) => {
    // Retorna una promesa resuelta para simular éxito
    return Promise.resolve({ data: { message: "Mock registration successful" } });
};

export const loginUser = (credentials) => {
    // Retorna un mock de token
    return Promise.resolve({ data: { token: "mock-token-abc" } });
};

// Asegúrate de incluir y mockear todas las exportaciones que tenga el archivo original.