package main

import (
	"encoding/json"
	// "errors"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var (
	usersFile = "users.json"
	jwtKey    = []byte("REPLACE_WITH_STRONG_SECRET")
)

// User represents a stored user
type User struct {
	ID       int    `json:"id"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type UsersData struct {
	Users []User `json:"users"`
}

type Claims struct {
	Email string `json:"email"`
	jwt.RegisteredClaims
}

type Store struct {
	mu    sync.Mutex
	Users []User `json:"users"`
}

type Employee struct {
	ID      int    `json:"id"`
	Nama    string `json:"nama"`
	Jabatan string `json:"jabatan"`
	Email   string `json:"email"`
	NoTelp  string `json:"no_telp"`
}

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	(*w).Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
	(*w).Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
}

func (s *Store) load() error {
	s.mu.Lock()
	defer s.mu.Unlock()

	if _, err := os.Stat(usersFile); os.IsNotExist(err) {
		s.Users = []User{}
		return s.save()
	}

	b, err := os.ReadFile(usersFile)
	if err != nil {
		return err
	}
	return json.Unmarshal(b, &s)
}

func (s *Store) save() error {
	s.mu.Lock()
	defer s.mu.Unlock()

	b, err := json.MarshalIndent(s, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(usersFile, b, 0644)
}

func addEmployeeHandler(w http.ResponseWriter, r *http.Request) {
	var employee Employee

	// Decode body request
	if err := json.NewDecoder(r.Body).Decode(&employee); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Baca file employees.json
	file, _ := os.ReadFile("employees.json")
	var employees []Employee
	json.Unmarshal(file, &employees)

	// Auto increment ID
	employee.ID = len(employees) + 1

	// Tambah ke list
	employees = append(employees, employee)

	// Tulis balik ke file
	data, _ := json.MarshalIndent(employees, "", "  ")
	_ = os.WriteFile("employees.json", data, 0644)

	// Response
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(employee)
}

func updateEmployeeHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Ambil ID dari URL
	idStr := strings.TrimPrefix(r.URL.Path, "/employee/")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	// Decode data baru
	var updated Employee
	if err := json.NewDecoder(r.Body).Decode(&updated); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Baca file employees.json
	file, _ := os.ReadFile("employees.json")
	var employees []Employee
	json.Unmarshal(file, &employees)

	// Cari employee berdasarkan ID
	found := false
	for i, emp := range employees {
		if emp.ID == id {
			// Update hanya field yang tidak kosong
			if updated.Nama != "" {
				employees[i].Nama = updated.Nama
			}
			if updated.Jabatan != "" {
				employees[i].Jabatan = updated.Jabatan
			}
			if updated.Email != "" {
				employees[i].Email = updated.Email
			}
			if updated.NoTelp != "" {
				employees[i].NoTelp = updated.NoTelp
			}

			found = true
			break
		}
	}

	if !found {
		http.Error(w, "Employee not found", http.StatusNotFound)
		return
	}

	// Tulis kembali ke file
	data, _ := json.MarshalIndent(employees, "", "  ")
	_ = os.WriteFile("employees.json", data, 0644)

	// Response
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Employee updated successfully",
	})
}

func deleteEmployeeHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Ambil ID dari URL
	idStr := strings.TrimPrefix(r.URL.Path, "/employee/")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	// Baca file employees.json
	file, err := os.ReadFile("employees.json")
	if err != nil {
		http.Error(w, "Cannot read file", http.StatusInternalServerError)
		return
	}

	var employees []Employee
	if err := json.Unmarshal(file, &employees); err != nil {
		http.Error(w, "Invalid JSON data", http.StatusInternalServerError)
		return
	}

	// Cari dan hapus employee
	found := false
	newEmployees := []Employee{}
	for _, emp := range employees {
		if emp.ID == id {
			found = true
			continue // skip employee yang ingin dihapus
		}
		newEmployees = append(newEmployees, emp)
	}

	if !found {
		http.Error(w, "Employee not found", http.StatusNotFound)
		return
	}

	// Tulis kembali ke file
	data, _ := json.MarshalIndent(newEmployees, "", "  ")
	if err := os.WriteFile("employees.json", data, 0644); err != nil {
		http.Error(w, "Failed to write file", http.StatusInternalServerError)
		return
	}

	// Response
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Employee deleted successfully",
	})
}

func main() {
	store := &Store{}
	if err := store.load(); err != nil {
		log.Fatalf("failed to load users: %v", err)
	}

	http.HandleFunc("/register", func(w http.ResponseWriter, r *http.Request) {
		enableCors(&w)

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		if r.Method != http.MethodPost {
			http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
			return
		}

		// decode request
		var creds User
		if err := json.NewDecoder(r.Body).Decode(&creds); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		var data UsersData
		content, err := os.ReadFile("users.json")
		if err == nil {
			_ = json.Unmarshal(content, &data)
		} else {
			data = UsersData{Users: []User{}}
		}

		newID := 1
		if len(data.Users) > 0 {
			lastUser := data.Users[len(data.Users)-1]
			newID = lastUser.ID + 1
		}

		// Tambahkan user baru
		newUser := User{
			ID:       newID,
			Email:    creds.Email,
			Password: creds.Password,
		}

		// Tambah user baru
		data.Users = append(data.Users, newUser)

		// Simpan ke file
		bytes, _ := json.MarshalIndent(data, "", "  ")
		_ = os.WriteFile("users.json", bytes, 0644)

		// Response
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{
			"message": "user registered successfully",
		})
	})

	http.HandleFunc("/login", func(w http.ResponseWriter, r *http.Request) {
		enableCors(&w)

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		if r.Method != http.MethodPost {
			http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
			return
		}

		var creds User
		if err := json.NewDecoder(r.Body).Decode(&creds); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		// Baca users.json
		var data UsersData
		content, err := os.ReadFile("users.json")
		if err == nil {
			_ = json.Unmarshal(content, &data)
		}

		// Cari user dengan email + password cocok
		var found *User
		for _, u := range data.Users {
			if u.Email == creds.Email && u.Password == creds.Password {
				found = &u
				break
			}
		}

		if found == nil {
			http.Error(w, "Invalid email or password", http.StatusUnauthorized)
			return
		}

		// Buat JWT token
		expirationTime := time.Now().Add(1 * time.Hour)
		claims := &Claims{
			Email: found.Email,
			RegisteredClaims: jwt.RegisteredClaims{
				ExpiresAt: jwt.NewNumericDate(expirationTime),
			},
		}

		token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
		tokenString, err := token.SignedString(jwtKey)
		if err != nil {
			http.Error(w, "Could not create token", http.StatusInternalServerError)
			return
		}

		// Response JSON token
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{
			"token": tokenString,
		})
	})

	http.HandleFunc("/me", func(w http.ResponseWriter, r *http.Request) {
		enableCors(&w)

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		tokenStr := r.Header.Get("Authorization")
		if tokenStr == "" {
			http.Error(w, "Missing token", http.StatusUnauthorized)
			return
		}

		// Hapus "Bearer " kalau ada
		if len(tokenStr) > 7 && tokenStr[:7] == "Bearer " {
			tokenStr = tokenStr[7:]
		}

		claims := &Claims{}
		token, err := jwt.ParseWithClaims(tokenStr, claims, func(token *jwt.Token) (interface{}, error) {
			return jwtKey, nil
		})

		if err != nil || !token.Valid {
			http.Error(w, "Invalid token", http.StatusUnauthorized)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{
			"email": claims.Email,
		})
	})

	http.HandleFunc("/employee/", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		// case http.MethodGet:
		//     getEmployeeHandler(w, r) // nanti bisa dibuat untuk GET
		case http.MethodPost:
			addEmployeeHandler(w, r) // POST untuk insert
		case http.MethodPut:
			updateEmployeeHandler(w, r) // PUT untuk update
		case http.MethodDelete:
			deleteEmployeeHandler(w, r) // DELETE untuk hapus
		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})

	// serve on :8000
	log.Println("Server running on :8000")
	log.Fatal(http.ListenAndServe(":8000", nil))
}
