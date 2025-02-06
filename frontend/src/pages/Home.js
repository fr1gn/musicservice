import { Link } from "react-router-dom";
import "../styles/main.css";

export default function Home() {
    return (
        <div className="container">
            <h1>Welcome to Gofy Music Service 🎵</h1>
            <p>Discover and manage your favorite music with ease!</p>
            <div className="home-buttons">
                <Link to="/register" className="btn">Register</Link>
                <Link to="/login" className="btn">Login</Link>
            </div>
        </div>
    );
}
