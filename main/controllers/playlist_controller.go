package controllers

import (
	"encoding/json"
	"log"
	"musicservice/main/database"
	"musicservice/main/models"
	"net/http"
)

func UpdatePlaylist(w http.ResponseWriter, r *http.Request) {
	playlistID := r.URL.Query().Get("id") // ✅ Получаем id из query-параметра

	var requestData struct {
		Name string `json:"name"`
	}

	if err := json.NewDecoder(r.Body).Decode(&requestData); err != nil {
		http.Error(w, "Invalid request data", http.StatusBadRequest)
		return
	}

	_, err := database.DB.Exec("UPDATE playlists SET name = $1 WHERE id = $2", requestData.Name, playlistID)
	if err != nil {
		http.Error(w, "Failed to update playlist: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Playlist updated successfully"})
}

func DeletePlaylist(w http.ResponseWriter, r *http.Request) {
	playlistID := r.URL.Query().Get("id") // ✅ Получаем id из query-параметра

	_, err := database.DB.Exec("DELETE FROM playlists WHERE id = $1", playlistID)
	if err != nil {
		http.Error(w, "Failed to delete playlist: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Playlist deleted successfully"})
}

func AddSongToPlaylist(w http.ResponseWriter, r *http.Request) {
	var data struct {
		PlaylistID int    `json:"playlist_id"`
		SongID     string `json:"song_id"` // ID трека из Spotify
		Title      string `json:"title"`   // Название трека
		Artist     string `json:"artist"`  // Исполнитель
	}

	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		http.Error(w, "Invalid request data", http.StatusBadRequest)
		return
	}

	// Проверка существования трека в таблице songs
	var localSongID int
	err := database.DB.Get(&localSongID, "SELECT id FROM songs WHERE spotify_id = $1", data.SongID)

	if err != nil {
		// Если трек не найден, добавляем его в таблицу songs
		_, err = database.DB.Exec("INSERT INTO songs (spotify_id, title, artist) VALUES ($1, $2, $3)", data.SongID, data.Title, data.Artist)
		if err != nil {
			http.Error(w, "Failed to add song to database: "+err.Error(), http.StatusInternalServerError)
			return
		}

		// Получаем локальный ID только что добавленного трека
		err = database.DB.Get(&localSongID, "SELECT id FROM songs WHERE spotify_id = $1", data.SongID)
		if err != nil {
			http.Error(w, "Failed to retrieve local song ID: "+err.Error(), http.StatusInternalServerError)
			return
		}
	}

	// Теперь добавляем трек в плейлист
	_, err = database.DB.Exec("INSERT INTO playlist_songs (playlist_id, song_id) VALUES ($1, $2)", data.PlaylistID, localSongID)
	if err != nil {
		http.Error(w, "Failed to add song to playlist: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "Song added successfully"})
}

func GetPlaylistSongs(w http.ResponseWriter, r *http.Request) {
	playlistID := r.URL.Query().Get("playlist_id")
	if playlistID == "" {
		http.Error(w, "Playlist ID is required", http.StatusBadRequest)
		return
	}

	var songs []models.Song
	err := database.DB.Select(&songs, "SELECT songs.* FROM playlist_songs JOIN songs ON playlist_songs.song_id = songs.id WHERE playlist_songs.playlist_id = $1", playlistID)
	if err != nil {
		http.Error(w, "Failed to fetch songs: "+err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(songs)
}

func GetRecentlyPlayed(w http.ResponseWriter, r *http.Request) {
	userID := r.URL.Query().Get("user_id")
	if userID == "" {
		http.Error(w, "User ID is required", http.StatusBadRequest)
		return
	}

	var recentlyPlayed []models.Song
	err := database.DB.Select(&recentlyPlayed, "SELECT songs.* FROM recently_played JOIN songs ON recently_played.song_id = songs.id WHERE recently_played.user_id = $1", userID)
	if err != nil {
		http.Error(w, "Failed to fetch recently played songs: "+err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(recentlyPlayed)
}

func GetKazakhSongs(w http.ResponseWriter, r *http.Request) {
	songs := []map[string]string{
		{"id": "1", "title": "Арман", "artist": "ILHAN", "image": "/images/arman.jpg"},
		{"id": "3", "title": "Туған жер", "artist": "МузАрт", "image": "/images/muzart.jpg"},
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(songs)
}

func CreatePlaylist(w http.ResponseWriter, r *http.Request) {
	var requestData struct {
		Name   string `json:"name"`
		UserID int    `json:"user_id"`
	}

	// ✅ Декодируем JSON-запрос
	if err := json.NewDecoder(r.Body).Decode(&requestData); err != nil {
		http.Error(w, "Invalid request data", http.StatusBadRequest)
		return
	}

	if database.DB == nil {
		http.Error(w, "❌ Database is not initialized!", http.StatusInternalServerError)
		return
	}

	// ✅ Логируем входные данные
	log.Println("🔧 Creating playlist with data:", requestData)

	var playlistID int
	err := database.DB.QueryRow("INSERT INTO playlists (name, user_id) VALUES ($1, $2) RETURNING id", requestData.Name, requestData.UserID).Scan(&playlistID)
	if err != nil {
		http.Error(w, "Failed to create playlist: "+err.Error(), http.StatusInternalServerError)
		return
	}

	response := map[string]interface{}{
		"id":      playlistID,
		"name":    requestData.Name,
		"user_id": requestData.UserID,
	}

	log.Println("✅ JSON Response:", response) // ✅ Логируем JSON перед отправкой
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response) // ✅ Теперь JSON-ответ будет корректным
}

func GetPlaylists(w http.ResponseWriter, r *http.Request) {
	userID := r.URL.Query().Get("user_id")
	if userID == "" {
		http.Error(w, "User ID is required", http.StatusBadRequest)
		return
	}

	var playlists []models.Playlist
	err := database.DB.Select(&playlists, "SELECT id, name, user_id FROM playlists WHERE user_id = $1", userID)
	if err != nil {
		log.Println("❌ Failed to fetch playlists:", err) // ✅ Логируем ошибку сервера
		http.Error(w, "Failed to fetch playlists: "+err.Error(), http.StatusInternalServerError)
		return
	}

	log.Println("✅ JSON Response (Playlists):", playlists) // ✅ Проверяем JSON перед отправкой
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(playlists)
}
