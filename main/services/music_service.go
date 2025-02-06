package services

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"strings"
)

const (
	SpotifyTokenURL = "https://accounts.spotify.com/api/token"
	SpotifyAPIBase  = "https://api.spotify.com/v1"
	ClientID        = "edc5364c60c24801a37b93ccc8b6e8ca"
	ClientSecret    = "ef2b30ae13054e52b0c2c671d74a9521"
)

var spotifyAccessToken string

// Get Spotify Access Token
func getSpotifyAccessToken() error {
	data := url.Values{}
	data.Set("grant_type", "client_credentials")

	req, _ := http.NewRequest("POST", SpotifyTokenURL, strings.NewReader(data.Encode()))
	req.SetBasicAuth(ClientID, ClientSecret)
	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	body, _ := ioutil.ReadAll(resp.Body)

	var result map[string]interface{}
	json.Unmarshal(body, &result)

	token, ok := result["access_token"].(string)
	if !ok {
		return fmt.Errorf("failed to get access token")
	}
	spotifyAccessToken = token
	return nil
}

// Search Songs on Spotify
func SearchSongs(query string) (map[string]interface{}, error) {
	if spotifyAccessToken == "" {
		if err := getSpotifyAccessToken(); err != nil {
			return nil, err
		}
	}

	url := fmt.Sprintf("%s/search?q=%s&type=track", SpotifyAPIBase, url.QueryEscape(query))
	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Add("Authorization", "Bearer "+spotifyAccessToken)

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, _ := ioutil.ReadAll(resp.Body)

	var result map[string]interface{}
	json.Unmarshal(body, &result)

	return result, nil
}

// Get Album Details from Spotify
func GetAlbumDetails(albumID string) (map[string]interface{}, error) {
	if spotifyAccessToken == "" {
		if err := getSpotifyAccessToken(); err != nil {
			return nil, err
		}
	}

	url := fmt.Sprintf("%s/albums/%s", SpotifyAPIBase, albumID)
	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Add("Authorization", "Bearer "+spotifyAccessToken)

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, _ := ioutil.ReadAll(resp.Body)

	var album map[string]interface{}
	json.Unmarshal(body, &album)

	return album, nil
}
