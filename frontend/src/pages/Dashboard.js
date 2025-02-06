import { Link } from "react-router-dom";
import "../styles/main.css";

export default function Dashboard() {
    return (
        <div className="container">
            <h2>Dashboard 📊</h2>
            <p>Manage your music, playlists, and explore more!</p>
            <ul>
                <li><Link to="/search" className="btn">Search Songs</Link></li>
                <li><Link to="/album" className="btn">View Album Details</Link></li>
            </ul>
        </div>
    );
}
