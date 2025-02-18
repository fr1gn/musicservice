package tests

import (
	"musicservice/main/controllers"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestRegister(t *testing.T) {
	payload := `{"email":"test@example.com","password":"password123"}`
	req := httptest.NewRequest("POST", "/api/register", strings.NewReader(payload))
	w := httptest.NewRecorder()

	controllers.Register(w, req)
	if w.Code != http.StatusOK {
		t.Errorf("Expected status 200, got %d", w.Code)
	}
}

func TestLogin(t *testing.T) {
	payload := `{"email":"test@example.com","password":"password123"}`
	req := httptest.NewRequest("POST", "/api/login", strings.NewReader(payload))
	w := httptest.NewRecorder()

	controllers.Login(w, req)
	if w.Code != http.StatusOK {
		t.Errorf("Expected status 200, got %d", w.Code)
	}
}
