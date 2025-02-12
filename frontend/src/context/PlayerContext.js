import React, { createContext, useState, useContext } from "react";

const PlayerContext = createContext();

export const usePlayer = () => useContext(PlayerContext);

export const PlayerProvider = ({ children }) => {
    const [currentTrack, setCurrentTrack] = useState(null);
    const [trackList, setTrackList] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [player, setPlayer] = useState(null);
    const [deviceId, setDeviceId] = useState(null);
    const [volume, setVolume] = useState(0.8);
    const token = "BQCc9Mgfnq2cUpc-uY7bTHuVA6cY-SYecnlNPRJhHJEdL4kVIAT_WFCL9yZ4orUe8NmIEiywTn0bpbGv3PQ9pkZyrAIaApQNSRzGvcuJiFgBjxlj5S-lA4R72YlMkTwq9G4OGpzfSRCdAkauJIBMTn0yrCNRCtayI-BMwzEYupgQJIfMIhiCCGaY9Pj-SpsQTuh-fVYTWoiBDXvLWNEIzVI9bBRCpXBxxucJECyLjG4lKJvNcnyU5yi1v_ugx06G"
    const playTrack = async (track, list = []) => {
        if (!player || !deviceId) return;

        try {
            await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
                method: "PUT",
                body: JSON.stringify({ uris: [track.uri] }),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            setCurrentTrack(track);
            setTrackList(list);
            setIsPlaying(true);
        } catch (error) {
            console.error("Error playing track:", error);
        }
    };

    const pauseTrack = async () => {
        if (!player || !deviceId) return;

        try {
            await fetch(`https://api.spotify.com/v1/me/player/pause?device_id=${deviceId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            setIsPlaying(false);
        } catch (error) {
            console.error("Error pausing track:", error);
        }
    };

    return (
        <PlayerContext.Provider value={{ currentTrack, trackList, isPlaying, playTrack, pauseTrack, player, setPlayer, deviceId, setDeviceId, volume, setVolume, token }}>
            {children}
        </PlayerContext.Provider>
    );
};
