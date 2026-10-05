package server

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func NewRouter() *gin.Engine {
	router := gin.Default()
	router.GET("/api/health", getHealth)
	return router
}

func getHealth(context *gin.Context) {
	context.JSON(http.StatusOK, gin.H{
		"status": "ok",
	})
}
