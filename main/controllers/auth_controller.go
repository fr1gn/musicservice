package controllers

import (
	"encoding/json"
	"golang.org/x/crypto/bcrypt"
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
	err := json.NewDecoder(r.Body).Decode(&creds)
	if err != nil {
		http.Error(w, `{"error": "Invalid input"}`, http.StatusBadRequest)
		return
	}

	// Hash password
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(creds.Password), bcrypt.DefaultCost)

	// Insert user into database
	_, err = database.DB.Exec("INSERT INTO users (email, password) VALUES ($1, $2)", creds.Email, hashedPassword)
	if err != nil {
		http.Error(w, `{"error": "Email already exists"}`, http.StatusConflict)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{"message": "User registered successfully"})
}

func Login(w http.ResponseWriter, r *http.Request) {
	var creds Credentials
	err := json.NewDecoder(r.Body).Decode(&creds)
	if err != nil {
		http.Error(w, `{"error": "Invalid request"}`, http.StatusBadRequest)
		return
	}

	var user models.User
	err = database.DB.Get(&user, "SELECT * FROM users WHERE email=$1", creds.Email)
	if err != nil {
		http.Error(w, `{"error": "Invalid email or password"}`, http.StatusUnauthorized)
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(creds.Password))
	if err != nil {
		http.Error(w, `{"error": "Invalid email or password"}`, http.StatusUnauthorized)
		return
	}

	token, _ := utils.GenerateToken(creds.Email)
	json.NewEncoder(w).Encode(map[string]string{"token": token}) // ✅ Return only the token
}

func DeleteUser(w http.ResponseWriter, r *http.Request) {
	email := r.URL.Query().Get("email")
	_, err := database.DB.Exec("DELETE FROM users WHERE email=$1", email)
	if err != nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	w.Write([]byte("User deleted"))
}
