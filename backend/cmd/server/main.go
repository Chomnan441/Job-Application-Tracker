package main

import (
	"context"
	"log"

	"github.com/Chomnan441/Job-Application-Tracker/backend/internal/db"
	"github.com/Chomnan441/Job-Application-Tracker/backend/internal/server"
	"github.com/joho/godotenv"
)

func main() {
	// A missing file is fine. Deployed environments set the variables themselves.
	// Values already present in the process are left unchanged.
	err := godotenv.Load()
	if err != nil {
		log.Println("no .env file, using environment variables")
	}

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
