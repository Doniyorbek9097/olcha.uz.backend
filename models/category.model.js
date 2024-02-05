const mongoose = require("mongoose");

const Schema = mongoose.Schema({
    name: {
        uz: {
            type: String,
            default: ""
        },
        ru: {
            type: String,
            default: ""
        }
    },

    image: String,

    left_banner: [
        {
            image: {
                uz: String,
                ru: String,
            },
            slug: String
        }
    ],


    top_banner: [
        {
            image: {
                uz: String,
                ru: String,
            },

            slug: String
        }
    ],

    slug: {
        type: String
    },

    brendId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Brend'
    },

    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
},

    { 
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }

);


Schema.virtual("products", {
    "ref": "Product",
    localField: "_id",
    foreignField: "parentCategory",
})



module.exports = mongoose.model("Category", Schema);