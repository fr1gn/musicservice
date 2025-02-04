package routes

import (
	"github.com/gorilla/mux"
	"musicservice/main/controllers"
	"musicservice/main/middleware"
	"net/http"
)

func RegisterRoutes() *mux.Router {
	router := mux.NewRouter()

	// Аутентификация
	router.HandleFunc("/api/register", controllers.Register).Methods("POST")
	router.HandleFunc("/api/login", controllers.Login).Methods("POST")
	router.Handle("/api/delete", middleware.AuthMiddleware(http.HandlerFunc(controllers.DeleteUser))).Methods("DELETE")

	// Deezer API
	router.HandleFunc("/api/deezer/search", controllers.SearchDeezerTrack).Methods("GET")

	return router
}
