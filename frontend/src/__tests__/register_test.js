import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "../components/Auth/Login";
import { AuthProvider } from "../context/AuthContext";

test("Renders login form correctly", () => {
    render(
        <AuthProvider>
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        </AuthProvider>
    );

    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
});

test("Displays error on incorrect login credentials", async () => {
    render(
        <AuthProvider>
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        </AuthProvider>
    );

    fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "wrong@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "wrongpassword" } });
    fireEvent.click(screen.getByText("Login"));

    expect(await screen.findByText("Login failed! Check the console for details.")).toBeInTheDocument();
});
