const { Schema, model, models } = require("mongoose");

const categorySchema = Schema({
    name: {
        type: String,
        intl: true
    },

    icon: String,
    image: String,

    // left_banner: {
    //     type: String,
    //     intl: true,
    // },


    // top_banner: {
    //     type: String,
    //     intl: true,
    // },

    slug: {
        type: String
    },

    brendId: {
        type: Schema.Types.ObjectId,
        ref: 'Brend'
    },


    parent: {
        ref: "Category",
        type: Schema.Types.ObjectId,
    },


    children: [{
        type: Schema.Types.ObjectId,
        ref: 'Category'
    }],


    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
},
    {
        timestamps: true,
        toJSON: { virtuals: true }
    }

);


categorySchema.virtual("carousel", {
    ref: "Carousel",
    localField: "_id",
    foreignField: "categories",
})


categorySchema.virtual("parentProducts", {
    ref: "Product",
    localField: "_id",
    foreignField: "parentCategory",
})


categorySchema.virtual("subProducts", {
    ref: "Product",
    localField: "_id",
    foreignField: "subCategory",
})


categorySchema.virtual("childProducts", {
    ref: "Product",
    localField: "_id",
    foreignField: "childCategory",
})



module.exports = models.Category || model("Category", categorySchema);