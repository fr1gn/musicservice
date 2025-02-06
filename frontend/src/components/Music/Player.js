import "../../styles/main.css";

export default function Player({ track }) {
    if (!track) return <p>Select a song to play.</p>;

    return (
        <div className="player-container">
            <h4>🎵 Now Playing: {track.name} - {track.artists[0].name}</h4>
            <audio controls autoPlay src={track.preview_url}></audio>
        </div>
    );
}
