const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

export const register = (email, password) =>
    fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

export const login = (email, password) =>
    fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

export const searchSongs = (query) =>
    fetch(`${API_URL}/search?q=${query}`).then((res) => res.json());

export const getAlbum = (id) =>
    fetch(`${API_URL}/album?id=${id}`).then((res) => res.json());
