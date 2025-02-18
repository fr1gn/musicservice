import { useEffect, useState } from "react";
import { usePlayer } from "../../context/PlayerContext";
import { fetchAlbums, fetchAlbumDetails } from "../../api/api";
import "../../styles/main.css";

export default function Albums() {
    const { token } = usePlayer();
    const [albums, setAlbums] = useState([]);
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadAlbums = async () => {
            if (!token) return;
            setLoading(true);
            try {
                const data = await fetchAlbums(token, "pop");
                setAlbums(data);
            } catch (err) {
                setError("Failed to load albums");
            } finally {
                setLoading(false);
            }
        };
        loadAlbums();
    }, [token]);

    const handleAlbumClick = async (albumId) => {
        if (!token) return;
        setLoading(true);
        try {
            const details = await fetchAlbumDetails(token, albumId);
            setSelectedAlbum(details);
        } catch (err) {
            setError("Failed to load album details");
        } finally {
            setLoading(false);
        }
    };

    const handleCloseDetails = () => {
        setSelectedAlbum(null);
    };

    const handleSearch = async () => {
        if (!searchQuery || !token) return;
        setLoading(true);
        try {
            const data = await fetchAlbums(token, searchQuery);
            setAlbums(data);
        } catch (err) {
            setError("Failed to search albums");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="albums-container" style={{ overflowY: 'auto', maxHeight: '80vh' }}>
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
            {!selectedAlbum ? (
                <div className="albums-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', overflowY: 'auto', maxHeight: '70vh' }}>
                    {albums.map((album) => (
                        <div key={album.id} className="album-card" onClick={() => handleAlbumClick(album.id)}>
                            <h3 className="album-title">{album.name}</h3>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="album-details">
                    <button className="close-button" onClick={handleCloseDetails}>Close</button>
                    <h2>{selectedAlbum.name}</h2>
                    <img className="album-detail-image" src={selectedAlbum.images[0]?.url} alt={selectedAlbum.name} />
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
