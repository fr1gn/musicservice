// import { useState } from "react";
//
// export default function Playlist() {
//     const [songs, setSongs] = useState([]);
//
//     const addSong = (song) => {
//         setSongs([...songs, song]);
//     };
//
//     return (
//         <div>
//             <h2>My Playlist 🎶</h2>
//             <ul>
//                 {songs.map((song, index) => (
//                     <li key={index}>{song}</li>
//                 ))}
//             </ul>
//         </div>
//     );
// }
import React, { useState, useEffect } from 'react';

const PlaylistManager = () => {
    const [playlists, setPlaylists] = useState([]);
    const [newPlaylistName, setNewPlaylistName] = useState('');
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [newSong, setNewSong] = useState({ title: '', artist: '', deezer_id: '' });

    useEffect(() => {
        fetchPlaylists();
    }, []);

    const fetchPlaylists = async () => {
        const response = await fetch('/api/playlists?user_id=1'); // Замените на актуальный user_id
        const data = await response.json();
        setPlaylists(data);
    };

    const createPlaylist = async () => {
        const response = await fetch('/api/playlists', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newPlaylistName, user_id: 1 }), // Замените на актуальный user_id
        });
        if (response.ok) {
            fetchPlaylists();
            setNewPlaylistName('');
        }
    };

    const addSong = async () => {
        const response = await fetch('/api/playlists/addsong', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ playlist_id: selectedPlaylist, song: newSong }),
        });
        if (response.ok) {
            fetchPlaylists();
            setNewSong({ title: '', artist: '', deezer_id: '' });
        }
    };

    const deleteSong = async (playlistId, songId) => {
        const response = await fetch('/api/playlists/deletesong', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ playlist_id: playlistId, song_id: songId }),
        });
        if (response.ok) {
            fetchPlaylists();
        }
    };

    const deletePlaylist = async (playlistId) => {
        const response = await fetch(`/api/playlists/delete?id=${playlistId}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            fetchPlaylists();
        }
    };

    return (
        <div>
            <h1>Playlist🎶</h1>
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
                    <li key={playlist.id}>
                        <h3>{playlist.name}</h3>
                        <ul>
                            {playlist.songs.map((song) => (
                                <li key={song.id}>
                                    {song.title} by {song.artist}
                                    <button onClick={() => deleteSong(playlist.id, song.id)}>Delete</button>
                                </li>
                            ))}
                        </ul>
                        <input
                            type="text"
                            value={newSong.deezer_id}
                            onChange={(e) => setNewSong({ ...newSong, deezer_id: e.target.value })}
                            placeholder="Deezer ID"
                        />
                        <button onClick={() => { setSelectedPlaylist(playlist.id); addSong(); }}>Add Song</button>
                        <button onClick={() => deletePlaylist(playlist.id)}>Delete Playlist</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PlaylistManager;
