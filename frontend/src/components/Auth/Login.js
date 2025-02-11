import { useState } from "react";
import { login as loginAPI } from "../../api/api";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import "../../styles/auth.css";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await loginAPI(email, password); // ✅ Use parsed data directly
            console.log("Parsed Response:", data); // ✅ Debug log
            login(data); // ✅ Store login data in auth context
            navigate("/dashboard"); // ✅ Redirect on success
        } catch (error) {
            console.error("Login error:", error);
            alert("Login failed. Please check your credentials.");
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
