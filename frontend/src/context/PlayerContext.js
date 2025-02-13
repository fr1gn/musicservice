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
    const token = "BQDkiidzrJh6Aw56X-q1ZFJbssl9io51fbI93fBaS4DRJzxbhdIZXegO6sQ9RslcaZwSFE1t66zka0SEQ97ojSGkU_C-3oYmy693HUP-pD476qgcVbMChdsu7O3o2U9qfD9f2rdPle232Pnsy-VDOdl_tdBNLclW3cAXlwdMM7-hBpJGzoiYk12UelGZ8K3TZpOJHtx5es0LQEWfljqWRCrgmugix3MGTWZ9neWDQTJhSNW3nAv119voq_WPAtXecc"

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
