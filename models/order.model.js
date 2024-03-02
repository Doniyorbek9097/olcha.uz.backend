const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Product"
        }
    ]
}) 