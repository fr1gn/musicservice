import { useState } from "react";
import { login as loginAPI } from "../../api/api";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import "../../styles/auth.css";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth(); // ✅ Use login function

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await loginAPI(email, password);
            login(response); // ✅ Update auth state
            navigate("/dashboard"); // ✅ Redirect to Dashboard
        } catch (error) {
            console.error("Login Error:", error);
            alert("Login failed! Check the console for details.");
        }
    };

    return (
        <div className="auth-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}
