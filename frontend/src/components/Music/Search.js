import { useState } from "react";
import { searchSongs } from "../../api/api";
import Player from "./Player"; // Importing the player component
import "../../styles/main.css";

export default function Search() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [currentTrack, setCurrentTrack] = useState(null); // Track currently playing
    const [error, setError] = useState("");

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const data = await searchSongs(query);
            setResults(data.tracks.items);
            setError("");
        } catch (err) {
            setError("Failed to fetch songs. Please try again later.");
        }
    };

    const handlePlay = (track) => {
        setCurrentTrack(track); // Set the track to play
    };

    return (
        <div className="search-container">
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for songs..."
                    required
                />
                <button type="submit">Search</button>
            </form>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <ul className="song-list">
                {results.map((track) => (
                    <li key={track.id} className="song-item">
                        <div>
                            <strong>{track.name}</strong> - {track.artists[0].name}
                        </div>
                        {track.preview_url ? (
                            <button onClick={() => handlePlay(track)}>▶ Play</button>
                        ) : (
                            <span className="no-preview">No Preview Available</span>
                        )}
                    </li>
                ))}
            </ul>

            {/* Audio Player */}
            {currentTrack && <Player track={currentTrack} />}
        </div>
    );
}
