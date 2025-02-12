import { useAuthContext } from "../context/AuthContext";
import { useEffect, useState } from "react";

const useAuth = () => {
    const { user, setUser } = useAuthContext();
    const [isAuthenticated, setIsAuthenticated] = useState(!!user || !!localStorage.getItem("user"));

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
        }
    }, [setUser]);

    const login = (userData) => {
        setUser(userData);  // ✅ Updates auth state
        localStorage.setItem("user", JSON.stringify(userData)); // ✅ Saves to storage
        setIsAuthenticated(true);  // ✅ Triggers navbar update
        window.dispatchEvent(new Event("storage")); // ✅ Forces navbar update
    };

    const logout = () => {
        setUser(null);  // ✅ Resets state
        localStorage.removeItem("user");
        setIsAuthenticated(false);
        window.dispatchEvent(new Event("storage")); // ✅ Triggers navbar update
    };

    return { user, isAuthenticated, login, logout };
};

export default useAuth;
