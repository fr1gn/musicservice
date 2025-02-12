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
		http.Error(w, `{"error": "User ID is required"}`, http.StatusBadRequest)
		log.Println("Error: Missing user_id parameter")
		return
	}

	log.Println("Fetching recently played songs for user:", userID)

	rows, err := database.DB.Query("SELECT title, artist FROM recently_played WHERE user_id=$1 ORDER BY played_at DESC LIMIT 10", userID)
	if err != nil {
		http.Error(w, `{"error": "Failed to fetch recently played songs"}`, http.StatusInternalServerError)
		log.Println("Database query error:", err)
		return
	}
	defer rows.Close()

	var songs []map[string]string
	for rows.Next() {
		var title, artist string
		rows.Scan(&title, &artist)
		songs = append(songs, map[string]string{"title": title, "artist": artist})
	}

	if len(songs) == 0 {
		log.Println("No recently played songs found for user:", userID)
	}

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
