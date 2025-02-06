package models

type Playlist struct {
	ID     int    `db:"id" json:"id"`
	Name   string `db:"name" json:"name"`
	UserID int    `db:"user_id" json:"user_id"`
}
