const mongooose = require("mongoose");

const colorSchema = mongooose.Schema({
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
        type:Array,
        default:[]
    }
});


module.exports = mongooose.model("Color", colorSchema);