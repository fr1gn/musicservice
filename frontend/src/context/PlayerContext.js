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
    const token = "BQBuWy11qhI44TqHrMXdSZMtRkwA6Hz67aLOQtvfuF2NQvsAdQY6CkNk9zhuqQNWfyytVd2eLd0x_U_5sT5wzeXEru82K2HR0Bvv7N3XCafVoIw2mrS-_AdcD8I6fhwVc62T8Wg4DaYoW18H3JHsgx3WXZkQHYC2NYiy4LlKt1MjW4kwrzjSHbSgvENIF-iRyu4rBcj9QQ18tlLPR84xR87PmOTEPzgDog_mpdzw8UsTom72lLwCVdYq88bG9-Kn"

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
