const mongooose = require("mongoose");

const cartSchema = mongooose.Schema({
    products: {
        type:mongooose.Schema.Types.ObjectId,
        ref:"Product"
    },

    quantity: {
        type:Number,
        default:0
    }
});

module.exports = mongooose.model("Cart", cartSchema);