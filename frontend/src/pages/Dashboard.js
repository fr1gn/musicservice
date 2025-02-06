import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Dashboard() {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" />; // Redirect if not logged in
    }

    return (
        <div>
            <h2>Dashboard 📊</h2>
            <p>Welcome to your dashboard!</p>
        </div>
    );
}
