const mongooose = require("mongoose");

const cartSchema = mongooose.Schema({
    user: {
        type: mongooose.Schema.Types.ObjectId,
        ref: "User"
    },

    products: [
        {
           product: {
                type: mongooose.Schema.Types.ObjectId,
                ref: "Product",
                required:true
            },

            color: {
                type:String,
            },

            size: {
                type: String,
            },

            memory: {
                type: String,
            },

            quantity: {
                type:Number,
                required:true
            }

            
        }
    ],
});

module.exports = mongooose.model("Cart", cartSchema);