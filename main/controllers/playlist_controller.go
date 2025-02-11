package controllers

import (
	"encoding/json"
	"musicservice/main/database"
	"musicservice/main/models"
	"net/http"
	"sync"
)

var playlists = make(map[int]models.Playlist)
var playlistIDCounter = 1
var mu sync.Mutex

// CreatePlaylist создает новый плейлист
func CreatePlaylist(w http.ResponseWriter, r *http.Request) {
	mu.Lock()
	defer mu.Unlock()

	var playlist models.Playlist
	if err := json.NewDecoder(r.Body).Decode(&playlist); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	playlist.ID = playlistIDCounter
	playlistIDCounter++
	playlists[playlist.ID] = playlist

	_, err := database.DB.Exec("INSERT INTO playlists (name, user_id) VALUES ($1, $2)", playlist.Name, playlist.UserID)
	if err != nil {
		http.Error(w, "Error creating playlist", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(playlist)
}

// GetPlaylists возвращает все плейлисты
func GetPlaylists(w http.ResponseWriter, r *http.Request) {
	mu.Lock()
	defer mu.Unlock()

	var allPlaylists []models.Playlist
	for _, playlist := range playlists {
		allPlaylists = append(allPlaylists, playlist)
	}

	json.NewEncoder(w).Encode(allPlaylists)
}

// AddSong добавляет песню в плейлист
func AddSong(w http.ResponseWriter, r *http.Request) {
	mu.Lock()
	defer mu.Unlock()

	var request struct {
		PlaylistID int         `json:"playlist_id"`
		Song       models.Song `json:"song"`
	}
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	playlist, exists := playlists[request.PlaylistID]
	if !exists {
		http.Error(w, "Playlist not found", http.StatusNotFound)
		return
	}

	playlist.Songs = append(playlist.Songs, request.Song)
	playlists[request.PlaylistID] = playlist

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(playlist)
}

// DeleteSong удаляет песню из плейлиста
func DeleteSong(w http.ResponseWriter, r *http.Request) {
	mu.Lock()
	defer mu.Unlock()

	var request struct {
		PlaylistID int `json:"playlist_id"`
		SongID     int `json:"song_id"`
	}

	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	playlist, exists := playlists[request.PlaylistID]
	if !exists {
		http.Error(w, "Playlist not found", http.StatusNotFound)
		return
	}

	for i, song := range playlist.Songs {
		if song.ID == request.SongID {
			playlist.Songs = append(playlist.Songs[:i], playlist.Songs[i+1:]...)
			playlists[request.PlaylistID] = playlist
			json.NewEncoder(w).Encode(playlist)
			return
		}
	}

	http.Error(w, "Song not found", http.StatusNotFound)
}

// DeletePlaylist удаляет плейлист
func DeletePlaylist(w http.ResponseWriter, r *http.Request) {
	id := r.URL.Query().Get("id")
	_, err := database.DB.Exec("DELETE FROM playlists WHERE id=$1", id)
	if err != nil {
		http.Error(w, "Error deleting playlist", http.StatusNotFound)
		return
	}

	w.Write([]byte("Playlist deleted"))
}
