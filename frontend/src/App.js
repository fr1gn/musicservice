import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/UI/Navbar";
import Footer from "./components/UI/Footer";
import Home from "./pages/Home";
import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import { AuthProvider } from "./context/AuthContext";
import "./styles/main.css";

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
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/profile" element={<Profile />} />
                    </Routes>
                </main>
                <Footer />
            </Router>
        </AuthProvider>
    );
}

export default App;
