package routes

import (
	"github.com/gorilla/mux"
	"musicservice/main/controllers"
	"musicservice/main/middleware"
)

func RegisterRoutes() *mux.Router {
	router := mux.NewRouter()

	router.HandleFunc("/api/register", controllers.Register).Methods("POST")
	router.HandleFunc("/api/login", controllers.Login).Methods("POST")

	// Spotify API Integration
	router.HandleFunc("/api/search", controllers.SearchSongs).Methods("GET")
	router.HandleFunc("/api/album", controllers.GetAlbum).Methods("GET")

	protected := router.PathPrefix("/api/playlist").Subrouter()
	protected.Use(middleware.AuthMiddleware)
	protected.HandleFunc("/create", controllers.CreatePlaylist).Methods("POST")
	protected.HandleFunc("/add-song", controllers.AddSongToPlaylist).Methods("POST")

	return router
}
