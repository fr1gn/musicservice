package services

import (
	"encoding/json"
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
		Get(fmt.Sprintf("%s/search", baseURL))

	if err != nil {
		log.Println("Error making request to Deezer:", err)
		return nil, err
	}

	var searchResponse SearchResponse
	if err := json.Unmarshal(resp.Body(), &searchResponse); err != nil {
		log.Println("Error decoding response:", err)
		return nil, err
	}

	return &searchResponse, nil
}
