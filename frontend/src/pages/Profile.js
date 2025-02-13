import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { changePassword, fetchRecentlyPlayed } from "../api/api";
import "../styles/main.css";

export default function Profile() {
    const { isAuthenticated, user, loading } = useAuth();
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [recentlyPlayed, setRecentlyPlayed] = useState([]);
    const [loadingSongs, setLoadingSongs] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadRecentlyPlayed = async () => {
            if (!user || !user.id) {
                console.warn("⚠️ User ID is missing, skipping fetch...");
                return;
            }

            try {
                console.log(`🎵 Fetching Recently Played Songs for User ID: ${user.id}`);
                const data = await fetchRecentlyPlayed(user.id);
                setRecentlyPlayed(data);
            } catch (error) {
                console.error("Error fetching recently played:", error);
            }
        };

        if (isAuthenticated) loadRecentlyPlayed();
    }, [isAuthenticated, user]);


    const handleChangePassword = async (e) => {
        e.preventDefault();
        try {
            await changePassword(user?.email, oldPassword, newPassword);
            alert("✅ Password updated successfully!");
            setOldPassword("");
            setNewPassword("");
        } catch (error) {
            alert("❌ Failed to update password.");
        }
    };

    if (!isAuthenticated) return <Navigate to="/login" />;
    if (loading) return <p>Loading user data...</p>; // ✅ Ожидаем загрузку user

    return (
        <div className="container">
            <h2>Profile 👤</h2>
            <p><strong>Email:</strong> {user?.email || "Unknown User"}</p>
            <p><strong>Account Status:</strong> Active</p>

            <h3>🔒 Change Password</h3>
            <form onSubmit={handleChangePassword}>
                <input type="password" placeholder="Old Password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required />
                <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                <button type="submit">Update Password</button>
            </form>

            <h3>🎵 Recently Played Songs</h3>
            {loadingSongs ? (
                <p>Loading recently played songs...</p>
            ) : error ? (
                <p style={{ color: "red" }}>{error}</p>
            ) : recentlyPlayed.length > 0 ? (
                <ul>
                    {recentlyPlayed.map((song, index) => (
                        <li key={index}><strong>{song.title}</strong> - {song.artist}</li>
                    ))}
                </ul>
            ) : (
                <p>No recently played songs found.</p>
            )}
        </div>
    );
}
