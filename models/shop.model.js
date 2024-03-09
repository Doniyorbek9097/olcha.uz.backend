const mongoose = require("mongoose");

const shopSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Do'kon nomi bo'lishi shart"],
        unique: true
    },

    slug: {
        type: String,
        required: true
    },

    discription: {
        type: String,
        intl: true
    },

    image: {
        type: String,
        default: "https://thumbs.dreamstime.com/b/shop-building-colorful-isolated-white-33822015.jpg"
    },

    bannerImage: {
        type: String,
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    isActive: {
        type: Boolean,
        default: false
    }

});

shopSchema.set("toObject", { virtuals: true });
shopSchema.set("toJSON", { virtuals: true });

shopSchema.virtual("products", {
    "ref": "Product",
    localField: "_id",
    foreignField: "shop"
})




module.exports = mongoose.model("Shop", shopSchema);

