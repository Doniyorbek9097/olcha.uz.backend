const mongooose = require("mongoose");

const colorSchema = mongooose.Schema({
    name: {
        type:String,
        require:true
    },

    image: {
        type:String,
        require:true
    }
});


module.exports = mongooose.model("Color", colorSchema);