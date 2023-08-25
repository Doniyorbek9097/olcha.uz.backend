const mongooose = require("mongoose");

const brendSchema = mongooose.Schema({
    name: {
        type:String,
        required:true
    },

    image: {
        type:String,
        required:true
    },

    discription: {
        uz: {
            type:String,
            default:""
        },

        ru: {
            type:String,
            default:""
        }
    }
});


module.exports = mongooose.model("Brend", brendSchema);