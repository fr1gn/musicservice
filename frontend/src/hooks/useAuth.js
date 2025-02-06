import { useAuthContext } from "../context/AuthContext";

const useAuth = () => {
    const { user, login, logout } = useAuthContext();

    const isAuthenticated = !!user; // Check if user is authenticated

    return {
        user,
        isAuthenticated,
        login,
        logout,
    };
};

export default useAuth;
