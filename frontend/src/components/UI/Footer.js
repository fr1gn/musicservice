import "../../styles/main.css";

export default function Footer() {
    return (
        <footer className="footer">
            <p>🎶 Gofy Music Service &copy; {new Date().getFullYear()}</p>
            <p>Developed with ❤️ for music lovers.</p>
        </footer>
    );
}
