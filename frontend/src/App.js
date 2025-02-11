import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/UI/Navbar";
import Footer from "./components/UI/Footer";
import Home from "./pages/Home";
import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import { AuthProvider } from "./context/AuthContext";
import useAuth from "./hooks/useAuth";  // ✅ Added Auth Hook
import "./styles/main.css";

// ✅ Protected Route Wrapper
const ProtectedRoute = ({ element }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? element : <Navigate to = "/login" />;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <main>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} /> {/* ✅ Protected */}
                        <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
                    </Routes>
                </main>
                <Footer />
            </Router>
        </AuthProvider>
    );
}

export default App;
