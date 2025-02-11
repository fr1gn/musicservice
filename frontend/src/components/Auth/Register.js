import { useState } from "react";
import { register } from "../../api/api";
import { useNavigate } from "react-router-dom"; // ✅ Added for navigation
import "../../styles/auth.css";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate(); // ✅ Initialize navigation
    const token = "BQD2S-aiIqwku7_RI3kENIWMtb0QnAxjGeEX7NF0t6yZ1w5lJPPYt3R4jaq6aV_IVNB3FWdY4FZT0IhhxbPW3wVMDew1dwmelm4SiOIIYvalI4LTh7yDIBxDXWDsksEiaiPxhBtnefwM5BBcFQqaAypr4ZFekziJ--Y45D17e-flqg06_IUiYE9GgggZ1AM5ydMxQqP-pqY8Ure5ItKlU4xvtkyIoNix0iULWGO4_jKzkHUxxjp_hILh1WNPffCz";

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await register(email, password);

        if (response.ok) {
            alert("Registration successful! Please log in.");
            navigate("/login"); // ✅ Redirect to  after registration
        } else {
            alert("Registration failed!");
        }
    };

    return (
        <div className="auth-container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                <button type="submit">Register</button>
            </form>
        </div>
    );
}
