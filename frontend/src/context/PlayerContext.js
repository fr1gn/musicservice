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
    const token = "BQBeO0NfzX9i_GDqHhTz3Q2hPlJpzyiV9jgtv6rfi6OJDcFfxKOyHR47bqdI0NnYL3YAP2MVMiJ6V239v3wWcZpIlSq3SpC0TEsFd1Cz7tzWbLkorU7Ipk41MOrvdRKsob_SKOyjHc8W8SxJPjw_g00hiNbM9U_KXMPx7n6i3ANurmnQT1kcP3iN4iUvoGp_t07KSm0xjTg9HskOGy4ez_g1M7UI-2GHGOeO9pMgBxkrV7jRFAHGPPEJU36Ors4VJ0FnVrWnk2H0BcU_bDoVumSdGPVKfjMoCkIjqANlkjM2VcFSfrV8RLZLIlOXpeZ6h8gMADUZYJ2cNG7D64C05EYB9Yci4k9tFpS0D9310-R5z_bXcwM3Tb3Ow3g"
    const playTrack = async (track, list = []) => {
        if (!player || !deviceId) {
            console.warn("🚫 Player or Device ID is missing!");
            return;
        }

        if (!track) {
            console.warn("🚫 Track is undefined!");
            return;
        }

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

            // Ensure trackList is set
            if (list.length > 0) {
                setTrackList(list);
            } else if (!trackList.includes(track)) {
                setTrackList([...trackList, track]);
            }

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
