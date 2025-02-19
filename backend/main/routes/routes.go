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
	router.HandleFunc("/api/fixed-albums", controllers.GetFixedAlbums).Methods("GET") // ✅ New Route

	// ✅ New Routes
	router.HandleFunc("/api/recently-played", controllers.GetRecentlyPlayed).Methods("GET")
	router.HandleFunc("/api/kazakh-songs", controllers.GetKazakhSongs).Methods("GET")
	router.HandleFunc("/api/playlist/create", controllers.CreatePlaylist).Methods("POST")

	// Protected Routes
	router.HandleFunc("/add-song", controllers.AddSongToPlaylist).Methods("POST")
	router.HandleFunc("/api/playlists", controllers.GetPlaylists).Methods("GET")
	router.HandleFunc("/api/playlist/update", controllers.UpdatePlaylist).Methods("PUT")
	router.HandleFunc("/api/playlist/delete", controllers.DeletePlaylist).Methods("DELETE")
	router.HandleFunc("/api/playlist/add-song", controllers.AddSongToPlaylist).Methods("POST")
	router.HandleFunc("/api/playlist/songs", controllers.GetPlaylistSongs).Methods("GET")

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
