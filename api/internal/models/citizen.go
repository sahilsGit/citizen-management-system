package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// For structuring, modifying & deleting documents
type Citizen struct {
	ID 				primitive.ObjectID  `bson:"_id,omitempty" json:"_id,omitempty"`
    FirstName 		string    			`bson:"firstName,omitempty" json:"firstName,omitempty"`
    LastName  		string    			`bson:"lastName,omitempty" json:"lastName,omitempty"`
    DateOfBirth 	primitive.DateTime 	`bson:"dateOfBirth,omitempty" json:"dateOfBirth,omitempty"`
    Gender    		string    			`bson:"gender,omitempty" json:"gender,omitempty"`
    Address   		string   			`bson:"address,omitempty" json:"address,omitempty"`
	City    		string 				`bson:"city,omitempty" json:"city,omitempty"`
    State   		string 				`bson:"state,omitempty" json:"state,omitempty"`
    Pincode 		int32 				`bson:"pincode,omitempty" json:"pincode,omitempty"`
}

// For adding new citizen
type AddCitizen struct {
    FirstName 		string    			`bson:"firstName" binding:"required" json:"firstName"`
    LastName  		string    			`bson:"lastName" binding:"required" json:"lastName"`
    DateOfBirth 	primitive.DateTime 	`bson:"dateOfBirth" binding:"required" json:"dateOfBirth"`
    Gender    		string    			`bson:"gender" binding:"required" json:"gender"`
    Address   		string   			`bson:"address" binding:"required" json:"address"`
	City    		string 				`bson:"city" binding:"required" json:"city"`
    State   		string 				`bson:"state" binding:"required" json:"state"`
    Pincode 		int32 				`bson:"pincode" binding:"required" json:"pincode"`
}

