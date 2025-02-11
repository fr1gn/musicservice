package models

type Playlist struct {
	ID     int    `json:"id" :"id"`
	Name   string `json:"name" :"name"`
	UserID int    `json:"user_id" :"user_id"`
	Songs  []Song `json:"song" :"songs"`
}
