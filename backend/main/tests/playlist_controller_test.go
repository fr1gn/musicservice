package tests

import (
	"musicservice/main/controllers"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestCreatePlaylist(t *testing.T) {
	payload := `{"name":"My Playlist","user_id":1}`
	req := httptest.NewRequest("POST", "/api/playlist/create", strings.NewReader(payload))
	w := httptest.NewRecorder()

	controllers.CreatePlaylist(w, req)
	if w.Code != http.StatusCreated {
		t.Errorf("Expected status 201, got %d", w.Code)
	}
}

func TestGetPlaylists(t *testing.T) {
	req := httptest.NewRequest("GET", "/api/playlists?user_id=1", nil)
	w := httptest.NewRecorder()

	controllers.GetPlaylists(w, req)
	if w.Code != http.StatusOK {
		t.Errorf("Expected status 200, got %d", w.Code)
	}
}
