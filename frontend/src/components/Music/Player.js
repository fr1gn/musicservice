export default function Player({ track }) {
    return (
        <div className="player">
            <h3>Now Playing: {track.name}</h3>
            <audio controls src={track.preview_url}></audio>
        </div>
    );
}
