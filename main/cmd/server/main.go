package main

import (
	"log"
	"musicservice/main/database"
	"musicservice/main/middleware"
	"musicservice/main/routes"
	"net/http"
)

func main() {
	database.Connect()
	router := routes.RegisterRoutes() // ✅ Ensures routes are loaded

	// Serve static files (if needed)
	fs := http.FileServer(http.Dir("../../controllers/images/"))
	http.Handle("/images/", http.StripPrefix("/images/", fs))

	// ✅ Ensure CORS is enabled on all routes
	http.Handle("/", middleware.EnableCORS(router))

	log.Println("Server started on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
