package http

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
)

type Request struct {
	Name string `json:"name"`
}

func greetHandler(w http.ResponseWriter, r *http.Request) {
	var req Request
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}
	response := fmt.Sprintf("Hello, %s!", req.Name)
	w.Write([]byte(response))
}

func main() {
	r := mux.NewRouter()
	r.HandleFunc("/api/greet", greetHandler).Methods("POST")

	fmt.Println("Server is running on http://localhost:8080")
	http.ListenAndServe(":8080", r)
}
