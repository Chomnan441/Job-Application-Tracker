package server

import (
	"net/http"

	"github.com/Chomnan441/Job-Application-Tracker/backend/internal/applications"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

func NewRouter(pool *pgxpool.Pool, userID uuid.UUID) *gin.Engine {
	router := gin.Default()
	router.GET("/api/health", getHealth)

	applicationsHandler := applications.NewHandler(pool, userID)
	router.GET("/api/applications", applicationsHandler.List)
	router.GET("/api/applications/:id", applicationsHandler.Get)
	router.POST("/api/applications", applicationsHandler.Create)
	return router
}

func getHealth(context *gin.Context) {
	context.JSON(http.StatusOK, gin.H{
		"status": "ok",
	})
}
