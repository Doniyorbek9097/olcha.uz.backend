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
        type: String,
        default:""
    },

    logo: {
        type:String,
        default:""
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