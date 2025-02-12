import { useState, useEffect } from "react";
import { usePlayer } from "../../context/PlayerContext";

export default function Search() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const { playTrack } = usePlayer();

    useEffect(() => {
        const savedQuery = sessionStorage.getItem("searchQuery");
        const savedResults = sessionStorage.getItem("searchResults");

        if (savedQuery) setQuery(savedQuery);
        if (savedResults) setResults(JSON.parse(savedResults));
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8080/api/search?q=${query}`);
            const data = await response.json();
            setResults(data.tracks?.items || []);

            sessionStorage.setItem("searchQuery", query);
            sessionStorage.setItem("searchResults", JSON.stringify(data.tracks?.items));
        } catch (error) {
            console.error("Error fetching songs:", error);
        }
    };

    const handlePlay = (track) => {
        playTrack(track, results); // ✅ No need to pass token manually
    };

    return (
        <div className="search-container">
            <h2>🔍 Search Songs</h2>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for your favorite songs..."
                    required
                />
                <button type="submit">Search</button>
            </form>

            <ul className="song-list">
                {results.map((track) => (
                    <li key={track.id} className="song-item">
                        <strong>{track.name}</strong> - {track.artists[0]?.name}
                        <button onClick={() => handlePlay(track)}>▶️ Play</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
