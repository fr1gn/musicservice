package middleware

import (
	"net/http"
)

func EnableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")                                // Разрешаем все источники
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS") // ✅ Добавили PUT и DELETE
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		// ✅ Обрабатываем preflight-запросы
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}
