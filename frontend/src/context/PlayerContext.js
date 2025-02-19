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
    const token = "BQDSQLM855l68HuBj1JBFzcait67vHFV-9V71as6jiYGVySOXZyL-HJXo-H-T7p69Z7cy7FTmHivClw_xNTFantRH3zv0LlQPxb8JH23TGiuGKFVK0QbBwxoAgWJTSWa951vizd7txw7VxyAVn1HZQ6M4fjWUkEu_wro4b4WXNLPM5e6TL25mHniLtGsBhc_y01PYSaqtmA_ykaSReGjlOGULugDTQA6I9Vi_iuaOOwIOUxPlfn0piLkBP8DHO_0"
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
