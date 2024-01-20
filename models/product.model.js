const mongoose = require("mongoose");

const Schema = mongoose.Schema({
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

    slug: {
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
    },

    properteis: [
        {
            uz: {
                type: String,
                default: ""
            },
            ru: {
                type: String,
                default: ""
            }
        }
    ],


    countInStock: {
        type: Number,
        min: 1    
    },

    price: {
        type:Number,
        required:true
    },

    totalPrice: {
        type: Number
    },

    isDiscount: {
        type:Boolean,
        default:false
    },

    discountPercent: {
        type:Number
    },


    quantity: {
        type:Number,
        default:0
    },

    sold: {
        type:Number,
        default:0
    },

    colors: [
        {
           name: String,
           code: String,
           images: Array
        }
    ],

    size: {
        type: String,
    },
   
    
    images: {
        type:Array,
        default:[]
    },
    
    

    parentCategory: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
        required:true
    },

    subCategory: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
        required:true
    },

    childCategory: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
        required:true
    },

    country: {
        type:String,
        default:""
    },

    brend: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brend"
    },

    // shop: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Shop"
    // },

    seller: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"

    },

    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    
}, 

{ 
  timestamps:true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
}

);

Schema.pre("save", function(next) {
    if(this.discountPercent) {
        this.totalPrice = this.price - this.price * this.discount_percent / 100;
    } 

    next();
})



module.exports = mongoose.model("Product", Schema);
