import { render, screen, fireEvent } from "@testing-library/react";
import Player from "../components/Music/Player";
import { PlayerProvider } from "../context/PlayerContext";

test("Renders player without a track", () => {
    render(
        <PlayerProvider>
            <Player />
        </PlayerProvider>
    );

    expect(screen.queryByText("Now Playing:")).not.toBeInTheDocument();
});

test("Play button changes to Pause on click", async () => {
    render(
        <PlayerProvider>
            <Player />
        </PlayerProvider>
    );

    const playButton = screen.getByText("▶️ Play");
    fireEvent.click(playButton);

    expect(await screen.findByText("⏸️ Pause")).toBeInTheDocument();
});

test("Next track button changes song", async () => {
    render(
        <PlayerProvider>
            <Player />
        </PlayerProvider>
    );

    const nextButton = screen.getByText("⏭️ Next");
    fireEvent.click(nextButton);

    expect(await screen.findByText("🎵 Now Playing:")).toBeInTheDocument();
});
