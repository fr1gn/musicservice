import { useState } from "react";
import { searchSongs } from "../../api/api";
import "../../styles/music.css";

export default function Search() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);

    const handleSearch = async (e) => {
        e.preventDefault();
        const data = await searchSongs(query);
        setResults(data.tracks.items);
    };

    return (
        <div className="container">
            <h2>Search Songs</h2>
            <form onSubmit={handleSearch}>
                <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search for a song" />
                <button type="submit">Search</button>
            </form>
            <ul>
                {results.map((track) => (
                    <li key={track.id}>
                        {track.name} - {track.artists[0].name}
                    </li>
                ))}
            </ul>
        </div>
    );
}
