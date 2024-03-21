package initializers

import (
	"context"
	"fmt"
	"log"
	"os"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)


var (
	Client *mongo.Client
	Citizens *mongo.Collection
)

// Establishes connection to MongoDB database
func Connect() {

	// Get uri
	uri := os.Getenv("MONGODB_URI")
	
	// Check if uri exists, terminate the program if it doesn't exist
	if uri == "" {
		log.Fatal("You must set your 'MONGODB_URI' environment variable.") 
	}
	
	// Establish connection or get an error
	loginClient, err := mongo.Connect(context.Background(), options.Client().ApplyURI(uri))

	// terminate the program if can't connect to DB 
	if err != nil {
		log.Fatal("Failed to connect to mongoDB")
	}

	// Log connection success
	fmt.Println("Successfully Connected to MongDB!")

	// Bind loginClient & Citizens for accessibility
	Client = loginClient
	Citizens = Client.Database("citizen-management").Collection("citizens")
}


// Disconnects the connected mongoDb client
func Close() error {
	return Client.Disconnect(context.Background())
}

