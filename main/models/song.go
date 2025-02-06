package models

type Song struct {
	ID       int    `db:"id" json:"id"`
	Title    string `db:"title" json:"title"`
	Artist   string `db:"artist" json:"artist"`
	Album    string `db:"album" json:"album"`
	Duration int    `db:"duration" json:"duration"`
}
