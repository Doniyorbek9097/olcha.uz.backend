const mongoose = require("mongoose");

const tokenSchema = mongoose.Schema({
    userId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    token: {
        type:String,
        index:true,
        unique:true,
        required:true
    },

    createdAt: { type: Date, default: Date.now, expires:3600 }
});



module.exports = mongoose.model("Token", tokenSchema);