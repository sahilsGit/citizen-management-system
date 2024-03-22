package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/sahilsGit/citizen-management-system/api/internal/controllers"
	"github.com/sahilsGit/citizen-management-system/api/internal/initializers"
)

func init() {
	initializers.LoadEnv() // Load Env
	initializers.Connect() // Connect to Database
}


func main() {

	// Initialize gin router
	router := gin.Default()
	router.Use(cors.Default())

	// Routes
	router.POST("/api/add", controllers.AddCitizen) // Adds Citizen
	router.GET("/api/citizens", controllers.GetCitizens) // Gets citizens
	router.PATCH("/api/edit/:id", controllers.EditCitizen) // Edits Citizens
	router.DELETE("/api/delete/:id", controllers.DeleteCitizen) // Deletes Citizen
	

	// Run the router
	router.Run() 
}