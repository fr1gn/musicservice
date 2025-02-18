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
    const token = "BQCUrbyX4YtWL5lG8S1Sx_lS3ng6pdvrKDDNVU8Q7yTrWG0Po6SfWSsjjBBs26WLMOLstQ5ZU0XxVrI9dR52w2SVWW_bzZxOH-JSkfjrwM_na4VTKdL700ior7Y1uIjjWjm1ivVW6MRVw2mOa5kU1EohVcFr6yVaauZocfVqSnYiulJsquy4RVOeXdqzGdctv32PMgAZXTG09FnLYXAUp8jzb9kaySG1icxBxkv9Qsfv3lKwcD6ASPS0jUu45lar"
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
