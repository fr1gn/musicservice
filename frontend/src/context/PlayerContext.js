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
    const token = "BQCVngXC0_RM5gJQRp4vXJwIpTG5As1CnNT817y7KbKaKWJxBgFrhIzWJEaqDYHNVcJqZyTVjBsl24abkjd832dHk_tIkbYpk4YggiIKL5tdyQdagZrjcdlWlbWZZwsdXwBj-xk40Y3q0edgv8LKr_h-zohftkGKAfr-cOUkoJn-dKfxMS8v0mGBPQjKgTOsYrJdBOxXNlSx1oBU4F8lP8EJQ47PeT2tKHthANrV5yVzkcWc8IC_6iReduBvdgFA"

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
