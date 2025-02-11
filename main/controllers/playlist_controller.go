package controllers

import (
	"encoding/json"
	"musicservice/main/database"
	"musicservice/main/models"
	"net/http"
)

// ✅ Recently Played Songs
func GetRecentlyPlayed(w http.ResponseWriter, r *http.Request) {
	songs := []map[string]string{
		{"id": "1", "title": "Daily Mix 1", "artist": "Kazakhstan Artist"},
		{"id": "2", "title": "Billie Eilish Radio", "artist": "Billie Eilish"},
		{"id": "3", "title": "Cold Case Files", "artist": "PodcastOne"},
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(songs)
}

// ✅ Kazakh Songs
func GetKazakhSongs(w http.ResponseWriter, r *http.Request) {
	songs := []map[string]string{
		{"id": "1", "title": "Арман", "artist": "ILHAN"},
		{"id": "2", "title": "Көк Аспан", "artist": "Нұржан Керменбаев"},
		{"id": "3", "title": "Туған жер", "artist": "МузАрт"},
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(songs)
}

func CreatePlaylist(w http.ResponseWriter, r *http.Request) {
	var playlist models.Playlist
	json.NewDecoder(r.Body).Decode(&playlist)
	database.DB.Exec("INSERT INTO playlists (name, user_id) VALUES ($1, $2)", playlist.Name, playlist.UserID)
	w.WriteHeader(http.StatusCreated)
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
