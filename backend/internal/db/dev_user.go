package db

import (
	"fmt"
	"os"

	"github.com/google/uuid"
)

func DevUserID() (uuid.UUID, error) {
	raw := os.Getenv("DEV_USER_ID")
	if raw == "" {
		return uuid.UUID{}, fmt.Errorf("DEV_USER_ID is empty")
	}

	userID, err := uuid.Parse(raw)
	if err != nil {
		return uuid.UUID{}, fmt.Errorf("parse DEV_USER_ID: %w", err)
	}

	return userID, nil
}
