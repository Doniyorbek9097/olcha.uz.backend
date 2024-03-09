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
        type: String,
        intl: true
    },

    image: {
        type: String,
        intl: true
    },

    logo: {
        type:String,
        default:""
    },

    discription: {
        type: String,
        intl: true
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