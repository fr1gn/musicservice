import { Navigate, Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Search from "../components/Music/Search";
import "../styles/main.css";

export default function Dashboard() {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="dashboard-container">
            <h2>📊 Dashboard</h2>
            <p>Manage your music, playlists, and explore more!</p>

            <div className="dashboard-links">
                <Link to="/search">🔍 Search Songs</Link>
                <Link to="/album">🎼 View Album Details</Link>
                <Link to="/playlist">🎵 My Playlists</Link>
            </div>

            <div className="music-section">
                <h3>🎧 Quick Music Search & Player</h3>
                <Search />
            </div>
        </div>
    );
}
