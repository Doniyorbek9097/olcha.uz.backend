const mongooose = require("mongoose");

const Schema = mongooose.Schema({
    name: {
        uz: {
            type:String,
            default:""
        },
        ru: {
            type:String,
            default:""
        }
    },

    image: {
        public_id:String,
        url:String
    },

    slug: {
        uz: {
            type:String,
            default:""
        },
        ru: {
            type:String,
            default:""
        }
    },

    icon: {
        type: String
    },

    parentId: {
        type:String
    },

    createdBy: {
        type:mongooose.Schema.Types.ObjectId,
        ref:"User"
    }
},

{timestamps:true}

);



Schema.set("toObject", { virtuals: true });
Schema.set("toJSON", { virtuals: true });



module.exports = mongooose.model("Category", Schema);