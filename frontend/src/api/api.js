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
export const fetchRecentlyPlayed = async (userId) => {
    if (!userId) {
        console.error("❌ Error: User ID is missing in fetchRecentlyPlayed()");
        return [];
    }

    try {
        console.log(`📡 Fetching Recently Played for User ID: ${userId}`);
        const response = await fetch(`http://localhost:8080/api/recently-played?user_id=${userId}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("❌ Failed to fetch recently played songs:", error);
        return [];
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

export const changePassword = async (email, oldPassword, newPassword) => {
    try {
        console.log("Calling API:", `${API_URL}/change-password`); // ✅ Remove extra `/api`

        const response = await fetch(`${API_URL}/change-password`, { // ✅ Remove extra `/api`
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, old_password: oldPassword, new_password: newPassword }),
        });

        const data = await response.json();
        if (!response.ok) {
            console.error("Error changing password:", data.error);
            throw new Error(data.error || "Failed to update password.");
        }

        return data;
    } catch (error) {
        console.error("Error changing password:", error);
        throw error;
    }
};






