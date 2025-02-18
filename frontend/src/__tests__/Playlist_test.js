import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Search from "../components/Music/Search";
import { AuthProvider } from "../context/AuthContext";

test("Search works correctly", async () => {
    render(
        <AuthProvider>
            <MemoryRouter>
                <Search />
            </MemoryRouter>
        </AuthProvider>
    );

    fireEvent.change(screen.getByPlaceholderText("Search for your favorite songs..."), { target: { value: "Bohemian Rhapsody" } });
    fireEvent.click(screen.getByText("Search"));

    expect(await screen.findByText("Queen")).toBeInTheDocument();
});
