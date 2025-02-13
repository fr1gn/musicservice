package controllers

import (
	"encoding/json"
	"log"
	"musicservice/main/database"
	"musicservice/main/models"
	"net/http"
)

func GetRecentlyPlayed(w http.ResponseWriter, r *http.Request) {
	userID := r.URL.Query().Get("user_id")
	if userID == "" {
		http.Error(w, "User ID is required", http.StatusBadRequest)
		return
	}

	var recentlyPlayed []models.Song
	err := database.DB.Select(&recentlyPlayed, "SELECT songs.* FROM recently_played JOIN songs ON recently_played.song_id = songs.id WHERE recently_played.user_id = $1", userID)
	if err != nil {
		http.Error(w, "Failed to fetch recently played songs: "+err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(recentlyPlayed)
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
	var requestData struct {
		Name   string `json:"name"`
		UserID int    `json:"user_id"`
	}

	// Parse JSON request body
	if err := json.NewDecoder(r.Body).Decode(&requestData); err != nil {
		http.Error(w, "Invalid request data", http.StatusBadRequest)
		return
	}

	// Check if the database connection is alive
	if database.DB == nil {
		http.Error(w, "❌ Database is not initialized!", http.StatusInternalServerError)
		return
	}

	// Debugging: Print request data
	log.Println("🔧 Creating playlist with data:", requestData)

	// Insert into DB
	_, err := database.DB.Exec("INSERT INTO playlists (name, user_id) VALUES ($1, $2)", requestData.Name, requestData.UserID)
	if err != nil {
		http.Error(w, "Failed to create playlist: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "Playlist created successfully"})
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
