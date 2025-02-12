package controllers

import (
	"encoding/json"
	"musicservice/main/services"
	"net/http"
)

// Search Songs using Spotify API
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
	json.NewEncoder(w).Encode(result) // ✅ Ensure JSON response
}

// Get Album Details using Spotify API
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

	json.NewEncoder(w).Encode(album)
}
