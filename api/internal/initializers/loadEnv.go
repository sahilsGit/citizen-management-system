package initializers

import (
	"log"

	"github.com/joho/godotenv"
)

func LoadEnv() {
	// Load variables using relative path
	err := godotenv.Load("../../.env")
	
	// If error occurs log Fatal and terminate 
	if err != nil {
	  log.Fatal("Error loading .env file", err.Error())
	}
}