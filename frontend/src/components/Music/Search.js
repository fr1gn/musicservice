import { useState, useEffect } from "react";
import { usePlayer } from "../../context/PlayerContext";
import useAuth from "../../hooks/useAuth";

export default function Search() {
    const { user } = useAuth();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const { playTrack } = usePlayer();

    useEffect(() => {
        const savedQuery = sessionStorage.getItem("searchQuery");
        const savedResults = sessionStorage.getItem("searchResults");

        if (savedQuery) setQuery(savedQuery);
        if (savedResults) setResults(JSON.parse(savedResults));

        fetchPlaylists();
    }, [user]);

    const fetchPlaylists = async () => {
        if (!user || !user.id) {
            console.warn("User is not logged in.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/playlists?user_id=${user.id}`, {
                headers: {
                    "Authorization": `Bearer ${user.token}`,
                    "Content-Type": "application/json"
                }
            });
            const data = await response.json();
            console.log("✅ Loaded playlists:", data);
            setPlaylists(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("❌ Error loading playlists:", error);
            setPlaylists([]);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8080/api/search?q=${query}`);
            const data = await response.json();
            console.log("✅ Search results:", data);

            setResults(Array.isArray(data.tracks?.items) ? data.tracks.items : []);
            sessionStorage.setItem("searchQuery", query);
            sessionStorage.setItem("searchResults", JSON.stringify(data.tracks?.items || []));
        } catch (error) {
            console.error("Error fetching songs:", error);
            setResults([]);
        }
    };

    const handleAddToPlaylist = async (song) => {
        if (!selectedPlaylist || !selectedPlaylist.id) {
            console.error("❌ Error: Playlist not selected or has invalid ID", selectedPlaylist);
            return;
        }

        if (!song || !song.id) {
            console.error("❌ Error: Song not found or has invalid ID", song);
            return;
        }

        const requestData = {
            playlist_id: Number(selectedPlaylist.id),  // 🔹 Преобразуем в число
            song_id: String(song.id)  // 🔹 song_id оставляем строкой
        };

        console.log("🛠 JSON Request Data before sending:", requestData);

        try {
            const response = await fetch("http://localhost:8080/api/playlist/add-song", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(requestData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("❌ Server Response:", errorText);
                throw new Error(`Failed to add song to playlist: ${errorText}`);
            }

            const data = await response.json();
            console.log("✅ Song added successfully!", data);
        } catch (error) {
            console.error("❌ Error adding song to playlist:", error);
        }
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

            <label>Select Playlist:</label>
            <select onChange={(e) => setSelectedPlaylist(playlists.find(p => p.id === Number(e.target.value)))}>
                <option value="">-- Choose a Playlist --</option>
                {playlists && Array.isArray(playlists) && playlists.length > 0 ? (
                    playlists.map(playlist => (
                        <option key={playlist.id} value={playlist.id}>
                            {playlist.name}
                        </option>
                    ))
                ) : (
                    <option disabled>No playlists available</option>
                )}
            </select>

            <ul className="playlist-list">
                {playlists && Array.isArray(playlists) && playlists.length > 0 ? (
                    playlists.map((playlist) => (
                        <li key={playlist.id}>{playlist.name}</li>
                    ))
                ) : (
                    <p>No playlists available.</p>
                )}
            </ul>

            <ul className="song-list">
                {Array.isArray(results) && results.length > 0 ? (
                    results.map((track) => (
                        <li key={track.id} className="song-item">
                            <strong>{track.name}</strong> - {track.artists[0]?.name}
                            <button onClick={() => playTrack(track)}>▶️ Play</button>
                            <button onClick={() => handleAddToPlaylist(track)}>➕ Add to Playlist</button>
                        </li>
                    ))
                ) : (
                    <p>No results found. Try searching for a song.</p>
                )}
            </ul>
        </div>
    );
}