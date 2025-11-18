// src/tests/Login.test.jsx
import React from 'react'; // 🚨 ¡IMPORTACIÓN FALTANTE! 🚨
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import { AuthContext } from "../context/AuthContext";

// Importa este módulo para poder usar .toBeInTheDocument()
import "@testing-library/jest-dom"; 

// 🚨 Nota sobre la importación de AuthContext:
// El error más persistente de tu CI/CD ocurre cuando AuthContext
// intenta importar el servicio 'auth.js' que usa import.meta.env.
// La única solución estable en CI es usar 'moduleNameMapper' o 'mockear'
// el servicio 'auth.js' (como discutimos antes). 
// Sin ese mock, las pruebas fallarán en la línea de 'import' del contexto.

describe("Login page", () => {

    // Prueba 1: Verifica que los campos de entrada estén presentes
    test("renderiza inputs email y password", () => {
        // Renderizamos el componente dentro de BrowserRouter y AuthContext
        render(
            <BrowserRouter>
                {/* Mockeamos el proveedor AuthContext para que no falle. */}
                <AuthContext.Provider value={{ login: jest.fn() }}>
                    <Login />
                </AuthContext.Provider>
            </BrowserRouter>
        );

        // Verificamos la presencia de los inputs por su placeholder
        expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Contraseña")).toBeInTheDocument();
        
        // Verificamos la presencia del botón de envío
        expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
    });

    // Prueba 2: Simula el envío del formulario y verifica que 'login' sea llamado
    test("envía el formulario y llama a login() con los datos correctos", async () => {
        // Creamos una función mock para simular la llamada a login
        const mockLogin = jest.fn().mockResolvedValue(true);

        render(
            <BrowserRouter>
                {/* Proveemos el mock a AuthContext */}
                <AuthContext.Provider value={{ login: mockLogin }}>
                    <Login />
                </AuthContext.Provider>
            </BrowserRouter>
        );

        // 1. Simular la entrada del email
        fireEvent.change(screen.getByPlaceholderText("Email"), {
            target: { value: "test@test.com" },
        });

        // 2. Simular la entrada de la contraseña
        fireEvent.change(screen.getByPlaceholderText("Contraseña"), {
            target: { value: "123456" },
        });

        // 3. Simular el click en el botón "Entrar"
        fireEvent.click(screen.getByText("Entrar"));

        // Verificamos que mockLogin fue llamado exactamente una vez con los valores correctos
        expect(mockLogin).toHaveBeenCalledTimes(1);
        expect(mockLogin).toHaveBeenCalledWith("test@test.com", "123456");
    });
});