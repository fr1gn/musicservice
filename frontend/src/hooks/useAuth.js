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
        console.log("🔹 Saving user data:", userData); // ✅ Лог для проверки

        if (!userData.id) {
            console.error("❌ Login response is missing user ID!", userData);
            return;
        }

        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        setIsAuthenticated(true);
        window.dispatchEvent(new Event("storage"));
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
