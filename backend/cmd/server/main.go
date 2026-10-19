package main

import (
	"context"
	"log"

	"github.com/Chomnan441/Job-Application-Tracker/backend/internal/db"
	"github.com/Chomnan441/Job-Application-Tracker/backend/internal/server"
)

func main() {
	userID, err := db.DevUserID()
	if err != nil {
		log.Fatal(err)
	}

	pool, err := db.Connect(context.Background())
	if err != nil {
		log.Fatal(err)
	}
	defer pool.Close()

	log.Println("connected to postgres")

	router := server.NewRouter(pool, userID)
	err = router.Run(":8080")
	if err != nil {
		log.Fatal(err)
	}
}
