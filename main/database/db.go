package database

import (
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
	"log"
)

var DB *sqlx.DB

func Connect() {
	var err error
	connStr := "user=postgres password=12345 dbname=gofy_music sslmode=disable"
	DB, err = sqlx.Connect("postgres", connStr)
	if err != nil {
		log.Fatal("Database connection failed:", err)
	}
}
