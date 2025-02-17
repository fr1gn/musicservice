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
    const token = "BQBnpGjVaP2Zj_MvWQ4z38NgR_XFV-41J2p0VQubMzeFzcQpqymfIM1Q7Rohh5hgw1Eh2VHPtD6YzaFEf1Vom7dn14U6iQgxXfpEqj4yW2K-YKjp5tE_g6LIUYlMwuydmqTbVV7bAQYZwwdqaUX20wazWBq5kKulf8zSD8Ohuy-1aCdGUc1OKh7PQGZFJMvc_aBG8QnoYg1r6YAoMPXSZktjBkS45gD-bJ9DAdn2PG8qnYnT_Tr_yYNYt0__zwz2"

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

    // ✅ Function to clear player when logging out
    const clearPlayer = () => {
        console.log("🛑 Clearing player...");
        if (player) {
            player.pause();
            player.disconnect();
        }
        setPlayer(null);
        setCurrentTrack(null);
        setTrackList([]);
        setIsPlaying(false);
        setDeviceId(null);
    };

    return (
        <PlayerContext.Provider value={{
            currentTrack, trackList, isPlaying, playTrack, pauseTrack,
            player, setPlayer, deviceId, setDeviceId, volume, setVolume, token,
            clearPlayer // ✅ Exposing clearPlayer
        }}>
            {children}
        </PlayerContext.Provider>
    );
};
