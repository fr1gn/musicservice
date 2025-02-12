import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePlayer } from "../../context/PlayerContext";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { updateToken } = usePlayer(); // ✅ Get updateToken function

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error("Login failed");
            }

            const data = await response.json();
            localStorage.setItem("spotify_token", data.token); // ✅ Save token locally
            updateToken(data.token); // ✅ Update PlayerContext with new token

            navigate("/dashboard"); // ✅ Redirect after login
        } catch (error) {
            console.error("Login error:", error);
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;
