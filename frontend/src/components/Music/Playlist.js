import { useState } from "react";

export default function Playlist() {
    const [songs, setSongs] = useState([]);

    const addSong = (song) => {
        setSongs([...songs, song]);
    };

    return (
        <div>
            <h2>My Playlist 🎶</h2>
            <ul>
                {songs.map((song, index) => (
                    <li key={index}>{song}</li>
                ))}
            </ul>
        </div>
    );
}
