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

	// Serve static files (если нужно)
	fs := http.FileServer(http.Dir("../../controllers/images/"))
	router.Handle("/images/", http.StripPrefix("/images/", fs))

	// ✅ Запускаем сервер с CORS middleware
	handler := middleware.EnableCORS(router)

	log.Println("Server started on :8080")
	log.Fatal(http.ListenAndServe(":8080", handler)) // ✅ Теперь CORS работает
}
