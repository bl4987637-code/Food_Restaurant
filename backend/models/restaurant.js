const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
    name:{
        type:String,
        required: [true,"Please enter the restaurant name"],
        trim:true,
        maxLength: [100,"Restaurant name cannot be more than 100 chars"]
    },

    isVeg:{
      type:Boolean,
      default:false
    },
    address: {
        type: String,
        required:[true, "Please provide address"]
    },
    ratings:{
        type:Number,
        default:0
    },
    numOfReviews:{
        type:Number,
        default:0
    },
    location:
    {
        type:{
            type:String,
            enum:["Point"],
            required:true,
        },
        coordinates:{
          type:[Number],
          required:true
        }
    },
    reviews: [
        {
            name:{
                type:String,
                required:true
            },
            rating:{
                type:Number,
                required:true,
            },
            Comment:{
                 type:String,
                 required:true
            }
        }
    ],
    images:[
        {
            public_id:{
                type:String,
                required:true
            },
            url:{
                  type:String,
                required:true
            }
        }
    ],
    reviewSentiment: {
        type: String,
    },
    reviewSummaryBullets: [{
        type: String,
    }],
    reviewTopMentions: [{
        type: String,
    }],
    createdAt:{
        type:Date,
        default:Date.now
    }
})

restaurantSchema.index({location:"2dsphere"});
restaurantSchema.index({address:"text"})

module.exports = mongoose.model("Restaurant", restaurantSchema)