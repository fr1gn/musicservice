package services

import (
	"fmt"
	"github.com/go-resty/resty/v2"
	"log"
)

const baseURL = "https://api.deezer.com"

type DeezerService struct {
	client *resty.Client
}

func NewDeezerService() *DeezerService {
	return &DeezerService{
		client: resty.New(),
	}
}

type SearchResponse struct {
	Data []struct {
		ID     int    `json:"id"`
		Title  string `json:"title"`
		Artist struct {
			Name string `json:"name"`
		} `json:"artist"`
	} `json:"data"`
}

func (ds *DeezerService) SearchTrack(query string) (*SearchResponse, error) {
	resp, err := ds.client.R().
		SetQueryParam("q", query).
		SetResult(&SearchResponse{}). // Автоматическое декодирование JSON
		Get(fmt.Sprintf("%s/search", baseURL))

	if err != nil {
		log.Println("Error making request to Deezer:", err)
		return nil, err
	}

	if resp.IsError() {
		log.Printf("Deezer API error: %s", resp.String())
		return nil, fmt.Errorf("deezer API error: %s", resp.String())
	}

	return resp.Result().(*SearchResponse), nil
}
