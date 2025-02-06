package controllers

import (
	"encoding/json"
	"musicservice/main/database"
	"musicservice/main/models"
	"musicservice/main/utils"
	"net/http"
)

type Credentials struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func Register(w http.ResponseWriter, r *http.Request) {
	var creds Credentials
	json.NewDecoder(r.Body).Decode(&creds)

	hashedPassword, _ := utils.HashPassword(creds.Password)
	_, err := database.DB.Exec("INSERT INTO users (email, password) VALUES ($1, $2)", creds.Email, hashedPassword)
	if err != nil {
		http.Error(w, "Email already exists", http.StatusConflict)
		return
	}

	w.WriteHeader(http.StatusCreated)
}

func Login(w http.ResponseWriter, r *http.Request) {
	var creds Credentials
	json.NewDecoder(r.Body).Decode(&creds)

	var user models.User
	err := database.DB.Get(&user, "SELECT * FROM users WHERE email=$1", creds.Email)
	if err != nil || !utils.CheckPasswordHash(creds.Password, user.Password) {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	token, _ := utils.GenerateToken(creds.Email)
	json.NewEncoder(w).Encode(map[string]string{"token": token})
}
