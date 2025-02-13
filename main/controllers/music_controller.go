package controllers

import (
	"encoding/json"
	"musicservice/main/services"
	"net/http"
)

// SearchSongs handles searching for songs using the Spotify API
func SearchSongs(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query().Get("q")
	if query == "" {
		http.Error(w, "Query parameter 'q' is required", http.StatusBadRequest)
		return
	}

	result, err := services.SearchSongs(query)
	if err != nil {
		http.Error(w, "Failed to fetch data from Spotify", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}

// GetAlbum handles fetching album details using the Spotify API
func GetAlbum(w http.ResponseWriter, r *http.Request) {
	albumID := r.URL.Query().Get("id")
	if albumID == "" {
		http.Error(w, "Query parameter 'id' is required", http.StatusBadRequest)
		return
	}

	album, err := services.GetAlbumDetails(albumID)
	if err != nil {
		http.Error(w, "Failed to fetch album from Spotify", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(album)
}

// GetFixedAlbums returns a predefined list of 5 specific albums
func GetFixedAlbums(w http.ResponseWriter, r *http.Request) {
	albums := []map[string]string{
		{"id": "3KuXEGcqLcnEYWnn3OEGy0", "name": "Abbey Road", "artist": "The Beatles", "image": "https://i.scdn.co/image/ab67616d00001e02a7c2361b17f6aaf196a3da56"},
		{"id": "2xBKTwOBThKGHUPWFgGJdX", "name": "Thriller", "artist": "Michael Jackson", "image": "https://i.scdn.co/image/ab67616d00001e02a5f6a2b2c4f3e6b8f3a6b79d"},
		{"id": "4m2880jivSbbyEGAKfITCa", "name": "Discovery", "artist": "Daft Punk", "image": "https://i.scdn.co/image/ab67616d00001e0273db8dbd7c49d49c0d5f3b12"},
		{"id": "7fdxISwGRhXIWHMSAkkrU1", "name": "DAMN.", "artist": "Kendrick Lamar", "image": "https://i.scdn.co/image/ab67616d00001e02c3a1d3f3281a3d5c5a6d6b79"},
		{"id": "2ZytN2cY4Zjrr9ukb2rqTP", "name": "Back to Black", "artist": "Amy Winehouse", "image": "https://i.scdn.co/image/ab67616d00001e021b5d6a2c3b1e6f9d9b6b79d"},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(albums)
}
