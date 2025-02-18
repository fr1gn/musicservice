const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";
const API_URLd = "https://api.spotify.com/v1";
const TOKEN = "BQCjfyo6n6Oa65X2waQO5qp9SuhbxpmiXyCybS-bC1SPSmjzmmwcj8pgaRUGQdCVTCD0E89rumuYjmC3GBMHbf4hvSzBYFtf_DoqoZiGSzdk0cZR-nEvYOMaIifnkdPDK8JllGDNNzNDOU0nSlCObyp7AWL8Dt95ufER07ZsWxZASuY_XEu3ke3RKa_cPvccHgJ2LaKbHcNqIhMWbc5wOCxE39VAzgmX8KQWvJlLYJqvI_0wh97tFPl8WJtfWess"

export const fetchAlbums = async (query) => {
    try {
        const response = await fetch(`${API_URLd}/search?q=${query}&type=album`, {
            headers: { Authorization: `Bearer ${TOKEN}` },
        });
        const data = await response.json();
        return data.albums.items; // Returns an array of albums
    } catch (error) {
        console.error("Error fetching albums:", error);
        return [];
    }
};

export const fetchAlbumDetails = async (albumId) => {
    try {
        const response = await fetch(`${API_URLd}/albums/${albumId}`, {
            headers: { Authorization: `Bearer ${TOKEN}` },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching album details:", error);
        return null;
    }
};


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






