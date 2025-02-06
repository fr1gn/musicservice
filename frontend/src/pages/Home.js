import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import "../styles/main.css";

export default function Home() {
    const { isAuthenticated } = useAuth();

    return (
        <div className="container">
            <h1>Welcome to Gofy Music Service 🎵</h1>
            <p>Discover and manage your favorite music with ease!</p>

            {isAuthenticated ? (
                <div className="home-buttons">
                    <Link to="/dashboard" className="btn">Go to Dashboard</Link>
                    <Link to="/profile" className="btn">View Profile</Link>
                </div>
            ) : (
                <div className="home-buttons">
                    <Link to="/register" className="btn">Register</Link>
                    <Link to="/login" className="btn">Login</Link>
                </div>
            )}
        </div>
    );
}
