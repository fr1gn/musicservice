import { useEffect, useState } from "react";
import { usePlayer } from "../../context/PlayerContext";
import "../../styles/main.css";

export default function Player() {
    const { currentTrack, isPlaying, pauseTrack, playTrack, trackList, token } = usePlayer();
    const [player, setPlayer] = useState(null);
    const [deviceId, setDeviceId] = useState(null);
    const [volume, setVolume] = useState(0.8);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [shuffle, setShuffle] = useState(false);
    const [repeat, setRepeat] = useState(false);

    useEffect(() => {
        if (!token) return;

        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {
            const spotifyPlayer = new window.Spotify.Player({
                name: "Gofy Music Player",
                getOAuthToken: cb => cb(token),
                volume,
            });

            spotifyPlayer.addListener("ready", ({ device_id }) => {
                console.log("Player ready with Device ID:", device_id);
                setDeviceId(device_id);
            });

            spotifyPlayer.addListener("player_state_changed", (state) => {
                if (state) {
                    setProgress(state.position);
                    setDuration(state.duration);
                    if (state.paused) pauseTrack();
                }
            });

            spotifyPlayer.connect();
            setPlayer(spotifyPlayer);
        };

        return () => {
            if (player) player.disconnect();
        };
    }, [token]);

    const handlePlayPause = () => {
        if (isPlaying) {
            pauseTrack();
            player.pause();
        } else if (currentTrack && deviceId) {
            playTrack(currentTrack, trackList);
            player.resume();
        }
    };

    const handleNext = () => {
        const currentIndex = trackList.findIndex(track => track.id === currentTrack.id);
        const nextIndex = shuffle
            ? Math.floor(Math.random() * trackList.length)
            : (currentIndex + 1) % trackList.length;

        playTrack(trackList[nextIndex], trackList);
    };

    const handlePrevious = () => {
        const currentIndex = trackList.findIndex(track => track.id === currentTrack.id);
        const prevIndex = (currentIndex - 1 + trackList.length) % trackList.length;
        playTrack(trackList[prevIndex], trackList);
    };

    const handleSeek = (e) => {
        const seekTime = parseInt(e.target.value);
        setProgress(seekTime);
        player.seek(seekTime);
    };

    const formatTime = (ms) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    if (!currentTrack) return null;

    return (
        <div className="global-player">
            <h4>🎵 Now Playing: {currentTrack.name} - {currentTrack.artists[0].name}</h4>

            <div className="player-controls">
                <button onClick={handlePrevious}>⏮️ Prev</button>
                <button onClick={handlePlayPause}>
                    {isPlaying ? "⏸️ Pause" : "▶️ Play"}
                </button>
                <button onClick={handleNext}>⏭️ Next</button>
                <button onClick={() => setShuffle(!shuffle)}>
                    {shuffle ? "🔀 Shuffle On" : "🔀 Shuffle Off"}
                </button>
                <button onClick={() => setRepeat(!repeat)}>
                    {repeat ? "🔁 Repeat On" : "🔁 Repeat Off"}
                </button>
            </div>

            <div className="progress-container">
                <span>{formatTime(progress)}</span>
                <input
                    type="range"
                    min="0"
                    max={duration}
                    value={progress}
                    onChange={handleSeek}
                    className="progress-bar"
                />
                <span>{formatTime(duration)}</span>
            </div>

            <div className="volume-container">
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="volume-slider"
                />
            </div>
        </div>
    );
}
