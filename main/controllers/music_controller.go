package controllers

import (
	"encoding/json"
	"musicservice/main/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

type DeezerController struct {
	service *services.DeezerService
}

func NewDeezerController(service *services.DeezerService) *DeezerController {
	return &DeezerController{service: service}
}

func (dc *DeezerController) SearchTrack(c *gin.Context) {
	query := c.Query("q")
	if query == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Параметр 'q' обязателен"})
		return
	}

	result, err := dc.service.SearchTrack(query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка при запросе к Deezer"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": result})
}

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
	_ = json.NewEncoder(w).Encode(result)
}
