package main

import (
	"log"
	"net/http"
)

func main() {
	hub := newHub()
	go hub.Run()

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		serveWs(hub, w, r)
	})

	log.Println("Server berjalan di http://localhost:8080")
	http.ListenAndServe(":8080", nil)
}
