const mongooose = require("mongoose");

const Schema = new mongooose.Schema({
    image: {
        type: String,
        intl: true
    },
    slug:{
        type:String,
    },

    categories: {
        type:mongooose.Schema.Types.ObjectId,
        ref:"Category"
    },

    brends: {
        type:mongooose.Schema.Types.ObjectId,
        ref:"Brend"
    },

},

{
    timestamps: true,
    toJSON: { virtuals: true}
}
);

module.exports = mongooose.model("Carousel", Schema);