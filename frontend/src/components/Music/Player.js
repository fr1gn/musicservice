import { useEffect, useState } from "react";
import { usePlayer } from "../../context/PlayerContext";
import "../../styles/main.css";

export default function Player() {
    const { currentTrack, isPlaying, pauseTrack, playTrack, trackList, player, setPlayer, deviceId, setDeviceId, volume, setVolume, token } = usePlayer();
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [shuffle, setShuffle] = useState(false);
    const [repeat, setRepeat] = useState(false);
    const [isPaused, setIsPaused] = useState(true);

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
                    setIsPaused(state.paused); // ✅ Ensures UI updates correctly
                }
            });

            spotifyPlayer.connect();
            setPlayer(spotifyPlayer);
        };

        return () => {
            if (player) player.disconnect();
        };
    }, [token]);

    // ✅ Updates progress bar every second
    useEffect(() => {
        const interval = setInterval(() => {
            if (player && isPlaying) {
                player.getCurrentState().then((state) => {
                    if (state) {
                        setProgress(state.position);
                        setDuration(state.duration);
                    }
                });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [isPlaying, player]);

    // ✅ Handles play/pause functionality correctly
    const handlePlayPause = async () => {
        if (!currentTrack) return;

        const state = await player.getCurrentState();
        if (state) {
            if (state.paused) {
                player.resume();
                setIsPaused(false); // ✅ Update UI state
            } else {
                player.pause();
                setIsPaused(true); // ✅ Update UI state
            }
        } else {
            playTrack(currentTrack, trackList);
            setIsPaused(false); // ✅ Set to playing when starting a new track
        }
    };

    const handleTrackEnd = () => {
        if (repeat) {
            playTrack(currentTrack, trackList); // 🔁 Repeat same track
        } else {
            handleNext(); // ⏭ Move to next track
        }
    };

    const handleNext = () => {
        if (!trackList.length) return;

        const currentIndex = trackList.findIndex(track => track.id === currentTrack.id);
        const nextIndex = shuffle
            ? Math.floor(Math.random() * trackList.length)
            : (currentIndex + 1) % trackList.length;

        playTrack(trackList[nextIndex], trackList);
        setIsPaused(false); // ✅ Ensure play/pause button updates
    };

    const handlePrevious = () => {
        if (!trackList.length) return;

        const currentIndex = trackList.findIndex(track => track.id === currentTrack.id);
        const prevIndex = (currentIndex - 1 + trackList.length) % trackList.length;
        playTrack(trackList[prevIndex], trackList);
        setIsPaused(false); // ✅ Ensure play/pause button updates
    };

    const handleSeek = async (e) => {
        const seekTime = parseInt(e.target.value);
        setProgress(seekTime);
        await player.seek(seekTime);
    };

    const handleShuffle = () => {
        setShuffle(!shuffle);
    };

    const handleRepeat = () => {
        setRepeat(!repeat);
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (player) {
            player.setVolume(newVolume);
        }
    };

    const formatTime = (ms) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    if (!currentTrack) return null; // ✅ Hide player until a song is played

    return (
        <div className="global-player">
            <h4>🎵 Now Playing: {currentTrack.name} - {currentTrack.artists[0].name}</h4>

            <div className="progress-bar">
                <span>{formatTime(progress)}</span>
                <input
                    type="range"
                    min="0"
                    max={duration}
                    value={progress}
                    onChange={handleSeek}
                    className="seek-bar"
                />
                <span>{formatTime(duration)}</span>
            </div>

            <div className="player-controls">
                <button onClick={handlePrevious}>⏮️ Prev</button>
                <button onClick={handlePlayPause}>
                    {isPaused ? "▶️ Play" : "⏸️ Pause"}
                </button>
                <button onClick={handleNext}>⏭️ Next</button>
                <button onClick={handleShuffle}>
                    {shuffle ? "🔀 Shuffle On" : "🔀 Shuffle Off"}
                </button>
                <button onClick={handleRepeat}>
                    {repeat ? "🔁 Repeat On" : "🔁 Repeat Off"}
                </button>
            </div>

            <div className="volume-container">
                <span>🔊</span>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="volume-slider"
                />
            </div>
        </div>
    );
}
