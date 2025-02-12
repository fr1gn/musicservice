import React, { useState, useEffect } from 'react';
import useAuth from "../../hooks/useAuth"; // ✅ Import remains the same


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


    const createPlaylist = async () => {
        try {
            const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : '';

            const response = await fetch('/api/playlist/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // ✅ Add this line
                },
                body: JSON.stringify({ name: newPlaylistName, user_id: user.id }),
            });

            const contentType = response.headers.get("content-type");

            if (!response.ok) {
                if (contentType && contentType.includes("application/json")) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Error creating playlist');
                } else {
                    const errorText = await response.text();
                    throw new Error(`Unexpected response: ${errorText}`);
                }
            }

            const data = await response.json();
            alert('Playlist created successfully!');
            fetchPlaylists();
            setNewPlaylistName('');
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to create playlist: ' + error.message);
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
            <button onClick={createPlaylist}>Create Playlist</button>

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
