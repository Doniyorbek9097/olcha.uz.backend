const mongooose = require("mongoose");

const brendSchema = mongooose.Schema({
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
        type: String,
        default:""
    },

    logo: {
        type:String,
        default:""
    },

    discription: {
       uz:String,
       ru:String
    },

});


module.exports = mongooose.model("Brend", brendSchema);