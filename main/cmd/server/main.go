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
	router := routes.RegisterRoutes()

	fs := http.FileServer(http.Dir("../../controllers/images/"))
	http.Handle("/images/", http.StripPrefix("/images/", fs))

	log.Println("Server started on :8080")
	log.Fatal(http.ListenAndServe(":8080", middleware.EnableCORS(router)))
}
