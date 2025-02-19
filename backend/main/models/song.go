package models

type Song struct {
	ID        int    `json:"id"`
	Title     string `json:"title"`
	Artist    string `json:"artist"`
	Album     string `json:"album"`
	SpotifyID string `db:"spotify_id" json:"spotify_id"`
	Duration  int    `json:"duration"`
}
