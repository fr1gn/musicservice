package database

import (
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
	"log"
)

var DB *sqlx.DB

func Connect() {
	var err error
	connStr := "user=postgres password=0000 dbname=gofy_music sslmode=disable"

	// Connect to PostgreSQL
	DB, err = sqlx.Connect("postgres", connStr)
	if err != nil {
		log.Fatal("❌ Database connection failed:", err)
	}

	// Ping to ensure connection is active
	err = DB.Ping()
	if err != nil {
		log.Fatal("❌ Database ping failed:", err)
	}

	log.Println("✅ Database successfully connected!")
}
