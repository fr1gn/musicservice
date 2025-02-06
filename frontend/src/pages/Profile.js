import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import "../styles/main.css";

export default function Profile() {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="container">
            <h2>Profile 👤</h2>
            <p><strong>Email:</strong> {user?.email || "Unknown User"}</p>
            <p><strong>Account Status:</strong> Active</p>
        </div>
    );
}
