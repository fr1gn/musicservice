package models

type Playlist struct {
	ID     int    `json:"id" db:"id"`
	Name   string `json:"name" db:"name"`
	UserID int    `json:"user_id" db:"user_id"` // ✅ Добавь `db:"user_id"` для соответствия БД
}
