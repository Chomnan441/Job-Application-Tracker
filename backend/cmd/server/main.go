package main

import (
	"log"

	"github.com/Chomnan441/Job-Application-Tracker/backend/internal/server"
)

func main() {
	router := server.NewRouter()

	err := router.Run(":8080")
	if err != nil {
		log.Fatal(err)
	}
}
