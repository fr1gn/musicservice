import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import "../../styles/main.css";

export default function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [authState, setAuthState] = useState(isAuthenticated); // ✅ Track auth changes

    // ✅ Listen for login/logout changes in localStorage
    useEffect(() => {
        const handleStorageChange = () => {
            setAuthState(!!localStorage.getItem("user"));
        };
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/"); // ✅ Redirect to home after logout
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/">🎵 Gofy Music</Link>
            </div>
            <ul className="navbar-links">
                {!authState && <li><Link to="/">Home</Link></li>}
                {authState && <li><Link to="/dashboard">Dashboard</Link></li>}
                {authState && <li><Link to="/profile">Profile ({user?.email})</Link></li>}
                {!authState && <li><Link to="/login">Login</Link></li>}
                {!authState && <li><Link to="/register">Register</Link></li>}
                {authState && (
                    <li>
                        <button onClick={handleLogout} className="logout-btn">Logout</button>
                    </li>
                )}
            </ul>
        </nav>
    );
}
