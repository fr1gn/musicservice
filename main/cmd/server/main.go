package main

import (
	"log"
	"musicservice/main/database"
	"musicservice/main/routes"
	"net/http"
)

func main() {
	database.Connect()
	router := routes.RegisterRoutes()

	log.Println("Server started on :8080")
	log.Fatal(http.ListenAndServe(":8080", router))
}
