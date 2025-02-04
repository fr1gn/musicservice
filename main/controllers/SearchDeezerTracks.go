package controllers

import (
	"encoding/json"
	"musicservice/main/services"
	"net/http"
)

func SearchDeezerTrack(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query().Get("q")
	if query == "" {
		http.Error(w, "Missing query parameter", http.StatusBadRequest)
		return
	}

	deezerService := services.NewDeezerService() // Создаём экземпляр сервиса
	result, err := deezerService.SearchTrack(query)
	if err != nil {
		http.Error(w, "Error fetching data from Deezer", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(result)
	if err != nil {
		return
	}
}
