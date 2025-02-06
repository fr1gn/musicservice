package controllers

import (
	"encoding/json"
	"musicservice/main/database"
	"musicservice/main/models"
	"net/http"
)

func GetSongs(w http.ResponseWriter, r *http.Request) {
	var songs []models.Song
	database.DB.Select(&songs, "SELECT * FROM songs")
	json.NewEncoder(w).Encode(songs)
}

func AddSong(w http.ResponseWriter, r *http.Request) {
	var song models.Song
	json.NewDecoder(r.Body).Decode(&song)
	database.DB.Exec("INSERT INTO songs (title, artist, album, duration) VALUES ($1, $2, $3, $4)",
		song.Title, song.Artist, song.Album, song.Duration)
	w.WriteHeader(http.StatusCreated)
}
