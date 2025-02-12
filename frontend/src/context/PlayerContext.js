import React, { createContext, useState, useContext } from "react";

const PlayerContext = createContext();

export const usePlayer = () => useContext(PlayerContext);

export const PlayerProvider = ({ children }) => {
    const [currentTrack, setCurrentTrack] = useState(null);
    const [trackList, setTrackList] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);

    const token = "BQBBEIjPPX_VDtpQkluGIK4n2UuQ-EyKUnfNZrchJrz_bcaEHpDmYgfxF_Y2uTmcPCExA35tJAW-wKIBPDMsbll4XD3TzE7I1-gZOm42JhDNuNwEz-HTEQJH-mk8skg1te8yP6Jnfn7vfnLMHv7ljSP5MrnfxnoiVNvzqSYj-GuobdzTk8dSqkIl0zb20apWsJ_Kcj93iHysaXNDZzbbCfM1EvH__gzDpGJMOmthcPv2QYrPvBI_G6R7XDUaTSTe";

    const playTrack = (track, list = []) => {
        setCurrentTrack(track);
        setTrackList(list);
        setIsPlaying(true);
    };

    const pauseTrack = () => setIsPlaying(false);

    return (
        <PlayerContext.Provider value={{ currentTrack, trackList, isPlaying, playTrack, pauseTrack, token }}>
            {children}
        </PlayerContext.Provider>
    );
};
