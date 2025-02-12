package controllers

import (
	"encoding/json"
	"musicservice/main/database"
	"musicservice/main/models"
	"net/http"
)

func GetRecentlyPlayed(w http.ResponseWriter, r *http.Request) {
	songs := []map[string]string{
		{"id": "1", "title": "Daily Mix 1", "artist": "Kazakhstan Artist", "image": "/images/dailymix.jpg"},
		{"id": "2", "title": "Billie Eilish Radio", "artist": "Billie Eilish", "image": "/images/chillmix.jpg"},
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(songs)
}

func GetKazakhSongs(w http.ResponseWriter, r *http.Request) {
	songs := []map[string]string{
		{"id": "1", "title": "Арман", "artist": "ILHAN", "image": "/images/arman.jpg"},
		{"id": "3", "title": "Туған жер", "artist": "МузАрт", "image": "/images/muzart.jpg"},
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(songs)
}

func CreatePlaylist(w http.ResponseWriter, r *http.Request) {
	var playlist models.Playlist
	err := json.NewDecoder(r.Body).Decode(&playlist)
	if err != nil {
		http.Error(w, "Invalid playlist data", http.StatusBadRequest)
		return
	}

	// Insert into the database
	result, err := database.DB.Exec("INSERT INTO playlists (name, user_id) VALUES ($1, $2)", playlist.Name, playlist.UserID)
	if err != nil {
		http.Error(w, "Failed to create playlist", http.StatusInternalServerError)
		return
	}

	// Return success message with inserted ID
	playlistID, _ := result.LastInsertId()
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "Playlist created successfully",
		"id":      playlistID,
	})
}

func AddSongToPlaylist(w http.ResponseWriter, r *http.Request) {
	var data struct {
		PlaylistID int `json:"playlist_id"`
		SongID     int `json:"song_id"`
	}
	json.NewDecoder(r.Body).Decode(&data)
	database.DB.Exec("INSERT INTO playlist_songs (playlist_id, song_id) VALUES ($1, $2)", data.PlaylistID, data.SongID)
	w.WriteHeader(http.StatusCreated)
}
