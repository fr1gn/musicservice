import { usePlayer } from "../context/PlayerContext";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";
const API_URLd = "https://api.spotify.com/v1";

// ✅ fetchAlbums теперь принимает token как аргумент
export const fetchAlbums = async (token, query) => {
    try {
        const response = await fetch(`${API_URLd}/search?q=${query}&type=album`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        return data.albums.items; // Returns an array of albums
    } catch (error) {
        console.error("Error fetching albums:", error);
        return [];
    }
};

// ✅ fetchAlbumDetails принимает token как аргумент
export const fetchAlbumDetails = async (token, albumId) => {
    try {
        const response = await fetch(`${API_URLd}/albums/${albumId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return await response.json();
    } catch (error) {
        console.error("Error fetching album details:", error);
        return null;
    }
};

// ✅ Внутри компонентов используем usePlayer() и передаем token в API-функции



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
export const addSongToPlaylist = async (token, playlistId, song) => {
    try {
        // ✅ Проверяем, существует ли песня в `songs`
        const checkResponse = await fetch(`http://localhost:8080/api/song?id=${song.id}`);
        if (!checkResponse.ok) {
            // ✅ Если песни нет, добавляем её
            console.log("📥 Song not found, adding to DB:", song);
            await fetch("http://localhost:8080/api/songs/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(song),
            });
        }

        // ✅ Теперь добавляем песню в плейлист
        const response = await fetch("http://localhost:8080/api/playlist/add-song", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ playlist_id: playlistId, song_id: song.id }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("❌ Server Response:", errorText);
            throw new Error(`Failed to add song to playlist: ${errorText}`);
        }

        console.log("✅ Song added to playlist successfully!");
    } catch (error) {
        console.error("❌ Error adding song to playlist:", error);
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






