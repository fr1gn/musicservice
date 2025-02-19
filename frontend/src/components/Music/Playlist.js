import React, { useState, useEffect } from 'react';
import useAuth from "../../hooks/useAuth"; // ✅ Import remains the same
import "../../styles/main.css";

// ✅ Move createPlaylist function OUTSIDE the component
export const createPlaylist = async (playlistName, storedUser) => {
    const user = storedUser || JSON.parse(localStorage.getItem("user")) || {};
    console.log("🔹 Current user in Playlist.js:", user);

    if (!user || !user.id) {
        console.error("❌ Error: User ID is missing, cannot create playlist.");
        return;
    }

    try {
        const response = await fetch("http://localhost:8080/api/playlist/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user.token}`
            },
            body: JSON.stringify({ name: playlistName, user_id: user.id })
        });

        if (!response.ok) {
            throw new Error(`Failed to create playlist: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("❌ Error creating playlist:", error);
        return null;
    }
};

const PlaylistManager = () => {
    const { user } = useAuth();
    const [storedUser, setStoredUser] = useState(user || JSON.parse(localStorage.getItem("user")));
    const [playlists, setPlaylists] = useState([]);
    const [newPlaylistName, setNewPlaylistName] = useState('');
    const [editingPlaylist, setEditingPlaylist] = useState(null);
    const [updatedName, setUpdatedName] = useState('');
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [songs, setSongs] = useState([]);

    useEffect(() => {
        const localUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser && localUser) {
            console.warn("⚠️ User is not loaded from context, updating...", localUser);
            setStoredUser(localUser);
        }
        fetchPlaylists();
    }, [user]);

    if (!storedUser) {
        return <p>Please log in to view your playlists.</p>;
    }

    const fetchPlaylists = async () => {
        if (!storedUser || !storedUser.id) {
            console.warn("User is not logged in.");
            setPlaylists([]);
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/playlists?user_id=${storedUser.id}`, {
                headers: {
                    "Authorization": `Bearer ${storedUser.token}`,
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

    const handleCreatePlaylist = async () => {
        const newPlaylist = await createPlaylist(newPlaylistName, storedUser);
        if (newPlaylist) {
            fetchPlaylists();
            setNewPlaylistName("");
        }
    };

    const handleDeletePlaylist = async (playlistId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/playlist/delete?id=${playlistId}`, {
                method: "DELETE",
                headers: { 'Authorization': `Bearer ${storedUser.token}` }
            });

            if (!response.ok) {
                throw new Error(`Failed to delete playlist: ${response.statusText}`);
            }

            fetchPlaylists();
        } catch (error) {
            console.error("Failed to delete playlist:", error);
        }
    };

    const handleEditPlaylist = async () => {
        if (!editingPlaylist) return;
        try {
            await fetch(`http://localhost:8080/api/playlist/update?id=${editingPlaylist.id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${storedUser.token}`
                },
                body: JSON.stringify({ name: updatedName })
            });

            setEditingPlaylist(null);
            setUpdatedName("");
            fetchPlaylists();
        } catch (error) {
            console.error("Failed to update playlist:", error);
        }
    };

    const fetchPlaylistSongs = async (playlistId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/playlist/songs?playlist_id=${playlistId}`);
            const data = await response.json();
            console.log(`📥 Songs fetched for playlist ${playlistId}:`, data);
            setSongs(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch songs:", error);
            setSongs([]);
        }
    };

    const handleSelectPlaylist = (playlist) => {
        setSelectedPlaylist(playlist);
        fetchPlaylistSongs(playlist.id);
    };

    return (
        <div className="playlist-container">
            <h1>🎶 Playlist Manager</h1>
            <input
                type="text"
                className="playlist-input"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder="New Playlist Name"
            />
            <button className="create-playlist-button" onClick={handleCreatePlaylist}>Create Playlist</button>

            <h2>Your Playlists</h2>
            <ul>
                {Array.isArray(playlists) && playlists.length > 0 ? (
                    playlists.map((playlist) => (
                        <li key={playlist.id} className="playlist-item">
                            {editingPlaylist && editingPlaylist.id === playlist.id ? (
                                <>
                                    <input
                                        type="text"
                                        value={updatedName}
                                        onChange={(e) => setUpdatedName(e.target.value)}
                                        placeholder="Edit Playlist Name"
                                    />
                                    <button onClick={handleEditPlaylist}>✔ Save</button>
                                </>
                            ) : (
                                <>
                                    <span>🎵 {playlist.name}</span>
                                    <button onClick={() => setEditingPlaylist(playlist)}>✏️ Edit</button>
                                    <button onClick={() => handleDeletePlaylist(playlist.id)}>🗑 Delete</button>
                                    <button onClick={() => handleSelectPlaylist(playlist)}>📂 View Songs</button>
                                </>
                            )}
                        </li>
                    ))
                ) : (
                    <p>No playlists found. Create one!</p>
                )}
            </ul>

            {selectedPlaylist && (
                <div className="playlist-songs">
                    <h2>Songs in "{selectedPlaylist.name}"</h2>
                    <ul>
                        {Array.isArray(songs) && songs.length > 0 ? (
                            songs.map((song) => (
                                <li key={song.id}>
                                    {song.title} - {song.artist}
                                    <button className="play-song-button">▶️ Play</button>
                                </li>
                            ))
                        ) : (
                            <p>No songs in this playlist.</p>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default PlaylistManager;
