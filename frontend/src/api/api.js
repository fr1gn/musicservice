const API_URL = "http://localhost:8080"; // ✅ Ensure this is correct

export const register = async (email, password) => {
    return fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
};

export const login = async (email, password) => { // ✅ Add missing login function
    return fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
};
