import { Navigate, Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Search from "../components/Music/Search";
import Player from "../components/Music/Player";
import "../styles/main.css";

export default function Dashboard() {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="container">
            <h2>Dashboard 📊</h2>
            <p>Manage your music, playlists, and explore more!</p>

            <ul>
                <li><Link to="/search" className="btn">Search Songs</Link></li>
                <li><Link to="/album" className="btn">View Album Details</Link></li>
                <li><Link to="/playlist" className="btn">My Playlists</Link></li>
            </ul>

            <h3>🎧 Quick Music Search & Player</h3>
            <Search />
            <Player />
        </div>
    );
}
