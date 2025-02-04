import { useState } from "react";
import { register } from "../../api/api";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await register(email, password);
        const data = await response.json(); // Convert response to JSON
        console.log("Response:", data); // Debugging output

        if (response.ok) {
            alert("Registration successful!");
        } else {
            alert("Registration failed: " + data.error); // Show actual error
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
            <button type="submit">Register</button>
        </form>
    );
}
