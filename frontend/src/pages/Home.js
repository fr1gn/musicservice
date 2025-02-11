import React, { useEffect, useState } from "react";
import { fetchKazakhSongs, fetchRecentlyPlayed } from "../api/api";
import "../styles/main.css";

export default function Home() {
    const [recentlyPlayed, setRecentlyPlayed] = useState([]);
    const [kazakhRecommendations, setKazakhRecommendations] = useState([]);

    useEffect(() => {
        const loadMusic = async () => {
            const recentData = await fetchRecentlyPlayed();
            const kazakhData = await fetchKazakhSongs();
            setRecentlyPlayed(recentData);
            setKazakhRecommendations(kazakhData);
        };
        loadMusic();
    }, []);

    return (
        <div className="home-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <h2>🎵 Gofy Music</h2>
                <nav>
                    <a href="/">Home</a>
                    <a href="/search">Search</a>
                    <a href="/library">Your Library</a>
                    <a href="/playlist">Create Playlist</a>
                    <a href="/liked" className="liked-songs">❤️ Liked Songs</a>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="content">
                <h2>Recently Played</h2>
                <div className="grid-container">
                    {recentlyPlayed.map((song) => (
                        <div className="card" key={song.id}>
                            <div className="cover" />
                            <h4>{song.title}</h4>
                            <p>{song.artist}</p>
                        </div>
                    ))}
                </div>

                <h2>Made for You (Kazakh Hits)</h2>
                <div className="grid-container">
                    {kazakhRecommendations.map((song) => (
                        <div className="card" key={song.id}>
                            <div className="cover" />
                            <h4>{song.title}</h4>
                            <p>{song.artist}</p>
                        </div>
                    ))}
                </div>
            </main>

            {/* Footer */}
            <footer className="music-bar">
                <p>🎶 Now Playing: Summer in the City - The Lovin’ Spoonful</p>
                <input type="range" min="0" max="100" value="28" className="progress" />
            </footer>
        </div>
    );
}
