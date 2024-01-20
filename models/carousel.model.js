const mongooose = require("mongoose");

const Schema = new mongooose.Schema({
    image: {
        uz:String,
        ru:String
    },
    slug:{
        type:String,
    }
});

module.exports = mongooose.model("Carousel", Schema);