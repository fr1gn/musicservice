import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/UI/Navbar";
import Footer from "./components/UI/Footer";
import Home from "./pages/Home";
import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Playlist from "./components/Music/Playlist";
import Search from "./components/Music/Search";
import Player from "./components/Music/Player";
import Album from "./components/Music/Album"
import { AuthProvider } from "./context/AuthContext";
import { PlayerProvider } from "./context/PlayerContext";
import useAuth from "./hooks/useAuth";
import "./styles/main.css";

const ProtectedRoute = ({ element }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? element : <Navigate to="/login" />;
};

function App() {
    return (
        <AuthProvider>
            <PlayerProvider>
                <Router>
                    <Navbar />
                    <main>
                        <Routes>
                            {/* Redirect logged-in users to Dashboard */}
                            <Route path="/" element={<AuthRedirect />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
                            <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
                            <Route path="/playlist" element={<ProtectedRoute element={<Playlist />} />} />
                            <Route path="/search" element={<ProtectedRoute element={<Search />} />} />
                            <Route path="/album" element={<ProtectedRoute element={<Album />} />} />
                        </Routes>
                    </main>
                    <Player /> {/* ✅ Global player */}
                    <Footer />
                </Router>
            </PlayerProvider>
        </AuthProvider>
    );
}

// Redirect function for Home page
function AuthRedirect() {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <Navigate to="/dashboard" /> : <Home />;
}

export default App;
