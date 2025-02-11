import { useAuthContext } from "../context/AuthContext";

const useAuth = () => {
    const { user, login, logout } = useAuthContext();

    const isAuthenticated = !!user || !!localStorage.getItem("user"); // ✅ Check localStorage

    return {
        user,
        isAuthenticated,
        login,
        logout,
    };
};

export default useAuth;
