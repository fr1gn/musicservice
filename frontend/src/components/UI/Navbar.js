import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import "../../styles/main.css";

export default function Navbar() {
    const { isAuthenticated, logout } = useAuth();

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/">🎵 Gofy Music</Link>
            </div>
            <ul className="navbar-links">
                {!isAuthenticated && <li><Link to="/">Home</Link></li>}
                {isAuthenticated && <li><Link to="/dashboard">Dashboard</Link></li>}
                {isAuthenticated && <li><Link to="/profile">Profile</Link></li>}
                {!isAuthenticated && <li><Link to="/login">Login</Link></li>}
                {!isAuthenticated && <li><Link to="/register">Register</Link></li>}
                {isAuthenticated && (
                    <li>
                        <button onClick={logout} className="logout-btn">Logout</button>
                    </li>
                )}
            </ul>
        </nav>
    );
}
