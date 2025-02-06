import { useState } from "react";
import { login as loginAPI } from "../../api/api";
import useAuth from "../../hooks/useAuth";
import "../../styles/auth.css";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await loginAPI(email, password);
        const data = await response.json();
        if (response.ok) {
            login(data.token); // Use the hook to set user token
            alert("Login successful!");
        } else {
            alert("Login failed!");
        }
    };

    return (
        <div className="auth-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}
