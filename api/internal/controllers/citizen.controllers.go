package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/sahilsGit/citizen-management-system/api/internal/initializers"
	"github.com/sahilsGit/citizen-management-system/api/internal/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)


func AddCitizen(ctx *gin.Context) {

	// Get the data off request body
	var body models.AddCitizen 
	
	if err := ctx.ShouldBindJSON(&body); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	// Insert the Citizen document
	res, err := initializers.Citizens.InsertOne(ctx, body)

	if err != nil {
		ctx.IndentedJSON(http.StatusBadRequest, gin.H{"error": "unable to add citizen"})
		return
	}

	// Return it
	citizen := models.Citizen{
		ID: res.InsertedID.(primitive.ObjectID),
    	FirstName: body.FirstName,	
    	LastName: body.LastName,
    	DateOfBirth: body.DateOfBirth,	
    	Gender:  body.Gender,  		
    	Address: body.Address, 		
		City: body.City,	
    	State: body.State, 		
    	Pincode: body.Pincode,
	}
    
	ctx.JSON(http.StatusCreated, citizen)

}

func GetCitizens(ctx *gin.Context) {
    // Get query parameters
    firstName := ctx.Query("fn")
    lastName := ctx.Query("ln")
    dateOfBirth := ctx.Query("dob")
    gender := ctx.Query("gd")
    address := ctx.Query("ad")
    city := ctx.Query("ct")
    state := ctx.Query("st")
    pincode := ctx.Query("pin")


    // Get the page and limit query parameters
    skip, err := strconv.Atoi(ctx.DefaultQuery("skip", "0"))
    if err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid skip number"})
        return
    }

    limit, err := strconv.Atoi(ctx.DefaultQuery("limit", "10"))
    if err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid limit value"})
        return
    }

    // Create a filter based on the provided query parameters
    filter := bson.M{}

    if firstName != "" {
        filter["firstName"] = firstName
    }
    if lastName != "" {
        filter["lastName"] = lastName
    }
    if dateOfBirth != "" {
        filter["dateOfBirth"] = dateOfBirth
    }
    if city != "" {
        filter["city"] = city
    }
    if state != "" {
        filter["state"] = state
    }
    if gender != "" {
        filter["gender"] = gender
    }
    if address != "" {
        filter["address"] = address
    }
    if pincode != "" {
        // convert string to number
        intPincode, err := strconv.Atoi(pincode)

        if err != nil {
            ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid query parameter"})
            return
        }

        filter["pincode"] = intPincode
    }

    // Set up the options for the Find operation
    findOptions := options.Find().SetSkip(int64(skip)).SetLimit(int64(limit))
    

    // Get found the cursor
    cursor, err := initializers.Citizens.Find(ctx, filter, findOptions)


    if err != nil {
        ctx.JSON(http.StatusInternalServerError, gin.H{"error": "unable to fetch documents"})
        return
    }

    // Close the cursor once the request is done or an error is thrown
    defer cursor.Close(ctx)

    // Declare an array of Citizen type to hold the citizens
    var citizens []models.Citizen

    // Iterate over the cursor and put each document into the array passed by address
    if err = cursor.All(ctx, &citizens); err != nil {
        ctx.JSON(http.StatusInternalServerError, gin.H{"error": "unable to fetch documents"})
        return
    }

    ctx.IndentedJSON(http.StatusOK, citizens)
}

func EditCitizen(ctx *gin.Context) {

    // Get the citizen ID from the URL parameter
    citizenID := ctx.Param("id")

    // Convert the id to MongoDB ObjectId type
    objID, err := primitive.ObjectIDFromHex(citizenID)
    if err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid citizen ID"})
        return
    }

    // To store the updated fields 
    var updateFields models.Citizen

    // Bind the request body to updateFields
    if err := ctx.ShouldBindJSON(&updateFields); err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
        return
    }

    // Queue the citizen document update  
    update := bson.M{"$set": updateFields}

    // Update the document
    result, err := initializers.Citizens.UpdateOne(ctx, bson.M{"_id": objID}, update)
    if err != nil {
        ctx.JSON(http.StatusInternalServerError, gin.H{"error": "unable to update citizen"})
        return
    }

    // Verify success
    if result.ModifiedCount == 0 {
        ctx.JSON(http.StatusNotFound, gin.H{"error": "citizen not found"})
        return
    }

    ctx.JSON(http.StatusOK, gin.H{"message": "citizen updated successfully"})
}


func DeleteCitizen(ctx *gin.Context) {

    // Get the citizen ID from the URL parameter
    citizenID := ctx.Param("id")

    // Convert the id to MongoDB ObjectId type
    objID, err := primitive.ObjectIDFromHex(citizenID)
    if err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid citizen ID"})
        return
    }

    // Delete the citizen document
    result, err := initializers.Citizens.DeleteOne(ctx, bson.M{"_id": objID})
    if err != nil {
        ctx.JSON(http.StatusInternalServerError, gin.H{"error": "unable to delete citizen"})
        return
    }

    // Verify success
    if result.DeletedCount == 0 {
        ctx.JSON(http.StatusNotFound, gin.H{"error": "citizen not found"})
        return
    }

    ctx.JSON(http.StatusOK, gin.H{"message": "citizen deleted successfully"})
}