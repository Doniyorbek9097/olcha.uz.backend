const mongoose = require("mongoose");

const brendSchema = mongoose.Schema({
    name: {
        type: String,
        default: ""
    },

    slug: {
        type: String,
        default:""
    },

    title: {
        uz:String,
        ru:String
    },

    image: {
        uz: String,
        ru: String
    },

    logo: {
        type:String,
        default:""
    },

    discription: {
       uz:String,
       ru:String
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

}, { timestamps: true });


brendSchema.set("toObject", { virtuals: true });
brendSchema.set("toJSON", { virtuals: true });

brendSchema.virtual("products", {
    "ref": "Product",
    localField: "_id",
    foreignField: "brend",
});

brendSchema.virtual("categories", {
    "ref": "Category",
    localField: "_id",
    foreignField: "brendId",
})


module.exports = mongoose.model("Brend", brendSchema);