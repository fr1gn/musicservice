import { useEffect, useState } from "react";
import "../../styles/main.css";

export default function Player({ track, trackList = [] }) {
    const [player, setPlayer] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.8);
    const [deviceId, setDeviceId] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(trackList.indexOf(track) || 0);
    const [currentTrack, setCurrentTrack] = useState(track);
    const [progress, setProgress] = useState(0); // ✅ Track progress
    const [duration, setDuration] = useState(0); // ✅ Track duration
    const token = "BQDZZk9eV4Nfjg16r5UvzS79UShzxMSFfGVNdgS9VkpX6RxOyTHL6fuTRkSCGzvCCkeCOHDI38B5tIFDz-pPWC8JzVJmTxbMrTfNBSwVJXA229EB1VCpl6DO8p27EXKQAIGNk9U48c04m5JPEEy5tDrHB2GSWDckbV9kcaS1XXhOMDRp7RXnf2BOJSpb6Dbx0vwjt5mulG5OyW962eUVNpHPpiBLUl9dH-7MbrL4bS8-kkLjtoQS1et7GIqRPUi6"
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {
            const spotifyPlayer = new window.Spotify.Player({
                name: "Gofy Music Player",
                getOAuthToken: cb => cb(token),
                volume: volume,
            });

            spotifyPlayer.connect();
            setPlayer(spotifyPlayer);

            spotifyPlayer.addListener("ready", ({ device_id }) => {
                setDeviceId(device_id);
            });

            spotifyPlayer.addListener("player_state_changed", (state) => {
                if (state) {
                    setIsPlaying(!state.paused);
                    setProgress(state.position);
                    setDuration(state.duration); // ✅ Get track duration
                }
            });
        };

        return () => {
            if (player) {
                player.disconnect();
            }
        };
    }, []);

    useEffect(() => {
        if (track && player && deviceId) {
            stopCurrentTrack();
            playTrack(deviceId, track.uri);
            setCurrentTrack(track);
            setCurrentIndex(trackList.indexOf(track));
        }
    }, [track]);

    const playTrack = async (device_id, trackUri) => {
        try {
            await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
                method: "PUT",
                body: JSON.stringify({ uris: [trackUri] }),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch (error) {
            console.error("Error playing track:", error);
        }
    };

    const stopCurrentTrack = async () => {
        try {
            await fetch(`https://api.spotify.com/v1/me/player/pause?device_id=${deviceId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch (error) {
            console.error("Error stopping track:", error);
        }
    };

    const handlePlayPause = async () => {
        if (player) {
            isPlaying ? await player.pause() : await player.resume();
        }
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (player) {
            player.setVolume(newVolume);
        }
    };

    const handleNext = () => {
        const nextIndex = (currentIndex + 1) % trackList.length;
        setCurrentIndex(nextIndex);
        setCurrentTrack(trackList[nextIndex]);
        stopCurrentTrack();
        playTrack(deviceId, trackList[nextIndex]?.uri);
    };

    const handlePrevious = () => {
        const prevIndex = (currentIndex - 1 + trackList.length) % trackList.length;
        setCurrentIndex(prevIndex);
        setCurrentTrack(trackList[prevIndex]);
        stopCurrentTrack();
        playTrack(deviceId, trackList[prevIndex]?.uri);
    };

    const handleSeek = async (e) => {
        const seekPosition = parseInt(e.target.value);
        setProgress(seekPosition);
        await player.seek(seekPosition); // ✅ Seek to the new position
    };

    const formatTime = (ms) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    if (!currentTrack) return <p>Select a song to play.</p>;

    return (
        <div className="player-container">
            <h4>🎵 Now Playing: {currentTrack.name} - {currentTrack.artists[0].name}</h4>

            {/* ✅ Seek Bar */}
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
                    {isPlaying ? "⏸️ Pause" : "▶️ Play"}
                </button>
                <button onClick={handleNext}>⏭️ Next</button>

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
