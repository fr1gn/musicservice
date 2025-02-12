package controllers

import (
	"encoding/json"
	"golang.org/x/crypto/bcrypt"
	"log"
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

	// ✅ Add Content-Type header
	w.Header().Set("Content-Type", "application/json")

	// ✅ Log the response for debugging
	response := map[string]string{
		"token":   token,
		"message": "Login successful",
		"email":   creds.Email,
	}
	log.Printf("Login Response: %+v\n", response) // ✅ Debug log

	json.NewEncoder(w).Encode(response)
}

func Changepassword(w http.ResponseWriter, r *http.Request) {
	var data struct {
		Email       string `json:"email"`
		OldPassword string `json:"old_password"`
		NewPassword string `json:"new_password"`
	}

	err := json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		http.Error(w, `{"error": "Invalid request format"}`, http.StatusBadRequest)
		log.Println("Error decoding JSON:", err)
		return
	}

	// Retrieve user from database
	var user models.User
	err = database.DB.Get(&user, "SELECT id, email, password FROM users WHERE email=$1", data.Email)
	if err != nil {
		http.Error(w, `{"error": "User not found"}`, http.StatusNotFound)
		log.Println("User not found:", err)
		return
	}

	// Compare old password
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(data.OldPassword))
	if err != nil {
		http.Error(w, `{"error": "Incorrect old password"}`, http.StatusUnauthorized)
		log.Println("Incorrect old password attempt for:", data.Email)
		return
	}

	// Hash the new password
	newHashedPassword, err := bcrypt.GenerateFromPassword([]byte(data.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, `{"error": "Password hashing failed"}`, http.StatusInternalServerError)
		log.Println("Error hashing new password:", err)
		return
	}

	// Update the password in database
	_, err = database.DB.Exec("UPDATE users SET password=$1 WHERE email=$2", newHashedPassword, data.Email)
	if err != nil {
		http.Error(w, `{"error": "Failed to update password"}`, http.StatusInternalServerError)
		log.Println("Database update failed:", err)
		return
	}

	log.Println("Password successfully updated for:", data.Email)
	json.NewEncoder(w).Encode(map[string]string{"message": "Password updated successfully"})
}
