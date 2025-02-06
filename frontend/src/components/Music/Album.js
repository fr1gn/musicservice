import { useState } from "react";
import { getAlbum } from "../../api/api";
import "../../styles/music.css";

export default function Album() {
    const [albumID, setAlbumID] = useState("");
    const [album, setAlbum] = useState(null);

    const handleGetAlbum = async (e) => {
        e.preventDefault();
        const data = await getAlbum(albumID);
        setAlbum(data);
    };

    return (
        <div className="container">
            <h2>Album Details</h2>
            <form onSubmit={handleGetAlbum}>
                <input type="text" value={albumID} onChange={(e) => setAlbumID(e.target.value)} placeholder="Enter Album ID" />
                <button type="submit">Get Album</button>
            </form>
            {album && (
                <div>
                    <h3>{album.name}</h3>
                    <p>By {album.artists.map(artist => artist.name).join(", ")}</p>
                    <img src={album.images[0].url} alt={album.name} width="200" />
                </div>
            )}
        </div>
    );
}
