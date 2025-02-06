package controllers

import (
	"encoding/json"
	"musicservice/main/database"
	"musicservice/main/models"
	"net/http"
)

func CreatePlaylist(w http.ResponseWriter, r *http.Request) {
	var playlist models.Playlist
	json.NewDecoder(r.Body).Decode(&playlist)

	_, err := database.DB.Exec("INSERT INTO playlists (name, user_id) VALUES ($1, $2)", playlist.Name, playlist.UserID)
	if err != nil {
		http.Error(w, "Error creating playlist", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
}

func GetPlaylists(w http.ResponseWriter, r *http.Request) {
	userID := r.URL.Query().Get("user_id")
	var playlists []models.Playlist

	err := database.DB.Select(&playlists, "SELECT * FROM playlists WHERE user_id=$1", userID)
	if err != nil {
		http.Error(w, "Error fetching playlists", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(playlists)
}

func DeletePlaylist(w http.ResponseWriter, r *http.Request) {
	id := r.URL.Query().Get("id")
	_, err := database.DB.Exec("DELETE FROM playlists WHERE id=$1", id)
	if err != nil {
		http.Error(w, "Error deleting playlist", http.StatusNotFound)
		return
	}

	w.Write([]byte("Playlist deleted"))
}
