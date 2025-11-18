import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import { AuthContext } from "../context/AuthContext";

describe("Login page", () => {

  test("renderiza inputs email y password", () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider value={{ login: jest.fn() }}>
          <Login />
        </AuthContext.Provider>
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Contraseña")).toBeInTheDocument();
  });

  test("envía el formulario y llama a login()", async () => {
    const mockLogin = jest.fn().mockResolvedValue(true);

    render(
      <BrowserRouter>
        <AuthContext.Provider value={{ login: mockLogin }}>
          <Login />
        </AuthContext.Provider>
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@test.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Contraseña"), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByText("Entrar"));

    expect(mockLogin).toHaveBeenCalledWith("test@test.com", "123456");
  });
});
