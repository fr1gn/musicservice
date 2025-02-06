package models

type Playlist struct {
	ID     int    `json:"id"`
	Name   string `json:"name"`
	UserID int    `json:"user_id"`
	Song   Song   `json:"song"`
}
