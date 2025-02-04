package routes

import (
	"github.com/gorilla/mux"
	"musicservice/main/controllers"
	"musicservice/main/middleware"
	"net/http"
)

func RegisterRoutes() *mux.Router {
	router := mux.NewRouter()

	router.HandleFunc("/api/register", controllers.Register).Methods("POST")
	router.HandleFunc("/api/login", controllers.Login).Methods("POST")
	router.Handle("/api/delete", middleware.AuthMiddleware(http.HandlerFunc(controllers.DeleteUser))).Methods("DELETE")

	router.HandleFunc("/api/playlists", middleware.AuthMiddleware(http.HandlerFunc(controllers.CreatePlaylist))).Methods("POST")
	router.HandleFunc("/api/playlists", middleware.AuthMiddleware(http.HandlerFunc(controllers.GetPlaylists))).Methods("GET")
	router.Handle("/api/playlists", middleware.AuthMiddleware(http.HandlerFunc(controllers.DeletePlaylist))).Methods("DELETE")
	return router
}
