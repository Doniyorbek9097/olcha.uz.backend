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

    image: {
        public_id: String,
        url: String
    },

    top_banner: {
        uz: [
            {
                type: String
            }
        ],

        ru: [
            {
                type: String
            }
        ]
    },

    left_banner: {
        uz: {
            type: String,
            default: ""
        },

        ru: {
            type: String,
            default: ""
        }
    },

    slug: {
        type: String,
        required: true
    },

    icon: {
        type: String
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

    { timestamps: true }

);


Schema.set("toObject", { virtuals: true });
Schema.set("toJSON", { virtuals: true });

Schema.virtual("products", {
    "ref": "Product",
    localField: "_id",
    foreignField: "parentCategory",
})



module.exports = mongoose.model("Category", Schema);