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
        type: String,
        required: true
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
        type: String,
        required:true
    },

    languages: {
        uz: {
            title: String,
            discription: String
        },

        ru: {
            title: String,
            discription: String
        }
    }
});


module.exports = mongooose.model("Brend", brendSchema);