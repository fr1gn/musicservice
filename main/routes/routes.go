package routes

import (
	"fmt"
	"github.com/gorilla/mux"
	"musicservice/main/controllers"
)

func RegisterRoutes() *mux.Router {
	router := mux.NewRouter()

	// Public Routes
	router.HandleFunc("/api/register", controllers.Register).Methods("POST")
	router.HandleFunc("/api/login", controllers.Login).Methods("POST")
	router.HandleFunc("/api/change-password", controllers.Changepassword).Methods("POST")
	router.HandleFunc("/api/search", controllers.SearchSongs).Methods("GET")
	router.HandleFunc("/api/album", controllers.GetAlbum).Methods("GET")

	// ✅ New Routes
	router.HandleFunc("/api/recently-played", controllers.GetRecentlyPlayed).Methods("GET")
	router.HandleFunc("/api/kazakh-songs", controllers.GetKazakhSongs).Methods("GET")
	router.HandleFunc("/api/playlist/create", controllers.CreatePlaylist).Methods("POST")

	// Protected Routes
	router.HandleFunc("/add-song", controllers.AddSongToPlaylist).Methods("POST")

	// ✅ Print all registered routes
	fmt.Println("Registered Routes:")
	router.Walk(func(route *mux.Route, router *mux.Router, ancestors []*mux.Route) error {
		path, _ := route.GetPathTemplate()
		methods, _ := route.GetMethods()
		fmt.Println(methods, path)
		return nil
	})

	return router
}
