package tests

import (
	"musicservice/main/middleware"
	"musicservice/main/routes"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestMainEndpoint(t *testing.T) {
	req := httptest.NewRequest("GET", "/api/search?q=test", nil)
	w := httptest.NewRecorder()

	handler := middleware.EnableCORS(routes.RegisterRoutes())
	handler.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("Expected status 200, got %d", w.Code)
	}
}
