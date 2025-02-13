import React, { useState } from "react";

const fixedAlbums = [
    {
        id: "1",
        name: "Abbey Road",
        artist: "The Beatles",
        image: "https://i.scdn.co/image/ab67616d00001e02a3b8a15e31f53f314a2093cb",
    },
    {
        id: "2",
        name: "Thriller",
        artist: "Michael Jackson",
        image: "https://i.scdn.co/image/ab67616d00001e02a3b8a15e31f53f314a2093cb",
    },
    {
        id: "3",
        name: "Random Access Memories",
        artist: "Daft Punk",
        image: "https://i.scdn.co/image/ab67616d00001e024b23f8c8e9f947c8e7338e25",
    },
    {
        id: "4",
        name: "DAMN.",
        artist: "Kendrick Lamar",
        image: "https://i.scdn.co/image/ab67616d00001e0273b7e3c21ebde28c09a74c42",
    },
    {
        id: "5",
        name: "Back to Black",
        artist: "Amy Winehouse",
        image: "https://i.scdn.co/image/ab67616d00001e02d4c5467b5a85c0c5a0f2072e",
    },
];

const Album = () => {
    const [albums, setAlbums] = useState([]);

    const handleViewAlbumDetails = () => {
        setAlbums(fixedAlbums);
    };

    return (
        <div>
            <h2>Album Details</h2>
            <button onClick={handleViewAlbumDetails}>View Album Details</button>
            <div>
                {albums.map((album) => (
                    <div key={album.id}>
                        <h3>{album.name}</h3>
                        <p>{album.artist}</p>
                        <img src={album.image} alt={album.name} width={200} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Album;
