import { useEffect, useState } from "react";
import { fetchAlbums, fetchAlbumDetails } from "../../api/api"; // ✅ Импорт API-функций
import "../../styles/main.css";

export default function Albums() {
    const [albums, setAlbums] = useState([]);
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadAlbums = async () => {
            setLoading(true);
            try {
                const data = await fetchAlbums("pop"); // ✅ Загружаем популярные альбомы по умолчанию
                setAlbums(data);
            } catch (err) {
                setError("Failed to load albums");
            } finally {
                setLoading(false);
            }
        };
        loadAlbums();
    }, []);

    const handleAlbumClick = async (albumId) => {
        setLoading(true);
        try {
            const details = await fetchAlbumDetails(albumId);
            setSelectedAlbum(details);
        } catch (err) {
            setError("Failed to load album details");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery) return;
        setLoading(true);
        try {
            const data = await fetchAlbums(searchQuery);
            setAlbums(data);
        } catch (err) {
            setError("Failed to search albums");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="albums-container">
            <h2>🎵 Albums</h2>

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search for an album..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button onClick={handleSearch}>Search</button>
            </div>

            {loading && <p>Loading albums...</p>}
            {error && <p className="error">{error}</p>}

            <div className="albums-grid">
                {albums.map((album) => (
                    <div key={album.id} className="album-card" onClick={() => handleAlbumClick(album.id)}>
                        <img src={album.image} alt={album.name} />
                        <h3>{album.name}</h3>
                        <p>{album.artist}</p>
                    </div>
                ))}
            </div>

            {selectedAlbum && (
                <div className="album-details">
                    <h2>{selectedAlbum.name}</h2>
                    <img src={selectedAlbum.images[0]?.url} alt={selectedAlbum.name} />
                    <p><strong>Artist:</strong> {selectedAlbum.artists.map(a => a.name).join(", ")}</p>
                    <p><strong>Tracks:</strong></p>
                    <ul>
                        {selectedAlbum.tracks.items.map(track => (
                            <li key={track.id}>{track.name}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}