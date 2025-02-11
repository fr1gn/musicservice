import { useState } from "react";
import { register as registerAPI } from "../../api/api";
import { useNavigate } from "react-router-dom";
import "../../styles/auth.css";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await registerAPI(email, password);
            console.log("Registration Response:", response); // ✅ Debug log
            alert("Registration successful!");
            navigate("/login");
        } catch (error) {
            console.error("Registration Error:", error); // ✅ Error log
            alert("Registration failed! Check the console for details.");
        }
    };

    return (
        <div className="auth-container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"
                       required/>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                       placeholder="Password" required/>
                <button type="submit">Register</button>
            </form>
        </div>
    );
}
