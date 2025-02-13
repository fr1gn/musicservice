import React, { useState, useEffect } from 'react';
import useAuth from "../../hooks/useAuth"; // ✅ Import remains the same

// ✅ Move createPlaylist function OUTSIDE the component
export const createPlaylist = async (playlistName) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) {
        console.error("❌ Error: User ID is missing, cannot create playlist.");
        return;
    }

    try {
        const response = await fetch("http://localhost:8080/api/playlist/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: playlistName, user_id: user.id }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to create playlist");

        console.log("✅ Playlist created successfully:", data);
        return data;
    } catch (error) {
        console.error("❌ Error creating playlist:", error);
    }
};


const PlaylistManager = () => {
    const { user } = useAuth(); // ✅ Correct: Inside the functional component
    const [playlists, setPlaylists] = useState([]);
    const [newPlaylistName, setNewPlaylistName] = useState('');

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser && !user) {
            console.warn("User is not logged in.");
        }
    }, []);

    if (!user) {
        return <p>Please log in to view your playlists.</p>;
    }

    const fetchPlaylists = async () => {
        if (!user || !user.id) { // ✅ Check if user exists
            console.warn("User is not logged in.");
            return;
        }

        try {
            const response = await fetch(`/api/playlists?user_id=${user.id}`, {
                headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`
                }
            });
            const data = await response.json();
            setPlaylists(data);
        } catch (error) {
            console.error("Failed to fetch playlists:", error);
        }
    };

    const handleCreatePlaylist = async () => {
        const newPlaylist = await createPlaylist(newPlaylistName);
        if (newPlaylist) {
            setPlaylists([...playlists, newPlaylist]);
            setNewPlaylistName("");
        }
    };

    return (
        <div>
            <h1>🎶 Playlist Manager</h1>
            <input
                type="text"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder="New Playlist Name"
            />
            <button onClick={handleCreatePlaylist}>Create Playlist</button>

            <h2>Your Playlists</h2>
            <ul>
                {playlists.map((playlist) => (
                    <li key={playlist.id}>{playlist.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default PlaylistManager;
