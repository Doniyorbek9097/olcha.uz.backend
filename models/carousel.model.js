const mongooose = require("mongoose");

const Schema = mongooose.Schema({
    image: {
        uz:String,
        ru:String
    },
    slug:{
        type:String,
        unique:true,
        index:true,
        required:true
    }
});

module.exports = mongooose.model("Carousel", Schema);