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
	router.HandleFunc("/api/songs", controllers.GetSongs).Methods("GET")
	router.HandleFunc("/api/songs", controllers.AddSong).Methods("POST")

	protected := router.PathPrefix("/api/playlist").Subrouter()
	protected.Use(middleware.AuthMiddleware)
	protected.HandleFunc("/create", controllers.CreatePlaylist).Methods("POST")
	protected.HandleFunc("/add-song", controllers.AddSongToPlaylist).Methods("POST")

	return router
}
