package controllers

import (
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
