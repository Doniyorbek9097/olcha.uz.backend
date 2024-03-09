const mongooose = require("mongoose");

const Schema = new mongooose.Schema({
    image: {
        type: String,
        intl: true
    },
    slug:{
        type:String,
    }
});

module.exports = mongooose.model("Carousel", Schema);