const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

// ✅ Register API
export const register = (email, password) =>
    fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    }).then((res) => res.json());

// ✅ Login API
export const login = (email, password) =>
    fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    }).then(async (res) => {
        if (!res.ok) {
            throw new Error("Login failed");
        }
        // ✅ Ensure JSON parsing happens here only
        const data = await res.json();
        console.log("API Response:", data); // ✅ Debug log
        return data;
    });

// ✅ Get Album by ID
export const getAlbum = (id) =>
    fetch(`${API_URL}/album?id=${id}`).then((res) => res.json());

// ✅ Search Songs API
export const searchSongs = async (query) => {
    try {
        const response = await fetch(`${API_URL}/search?q=${query}`);
        if (!response.ok) throw new Error("Failed to fetch songs");
        return await response.json();
    } catch (error) {
        console.error("Error searching songs:", error);
        throw error;
    }
};

/// ✅ Fetch Recently Played Songs
export const fetchRecentlyPlayed = async () => {
    try {
        const response = await fetch(`${API_URL}/recently-played`);
        if (!response.ok) throw new Error("Failed to fetch recently played");
        return await response.json();
    } catch (error) {
        console.error("Error fetching recently played:", error);
        throw error;
    }
};

// ✅ Fetch Kazakh Songs
export const fetchKazakhSongs = async () => {
    try {
        const response = await fetch(`${API_URL}/kazakh-songs`);
        if (!response.ok) throw new Error("Failed to fetch Kazakh songs");
        return await response.json();
    } catch (error) {
        console.error("Error fetching Kazakh songs:", error);
        throw error;
    }
};

// ✅ Create Playlist (Protected)
export const createPlaylist = async (token, playlistName) => {
    try {
        const response = await fetch(`${API_URL}/playlist/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ name: playlistName }),
        });
        return await response.json();
    } catch (error) {
        console.error("Error creating playlist:", error);
        throw error;
    }
};

// ✅ Add Song to Playlist (Protected)
export const addSongToPlaylist = async (token, playlistId, songId) => {
    try {
        const response = await fetch(`${API_URL}/playlist/add-song`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ playlistId, songId }),
        });
        return await response.json();
    } catch (error) {
        console.error("Error adding song to playlist:", error);
        throw error;
    }
};
