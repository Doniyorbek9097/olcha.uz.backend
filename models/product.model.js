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

    richDescription: {
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
        min: 0,
        max: 255
    },

    price: {
        type:Number,
        required:true
    },

    discount: {
        type:Boolean,
        default:false
    },

    discount_percent: {
        type:Number
    },

    rating: {
        type: Number,
        default: 0,
    },

    numReviews: {
        type: Number,
        default: 0,
    },

    isFeatured: {
        type: Boolean,
        default: false,
    },

    quantity: {
        type:Number,
        default:0
    },

    sold: {
        type:Number,
        default:0
    },

    color: [
        {
            type:mongooose.Types.ObjectId,
            ref:"Color"
        }
    ],

    size: [
        {
            type:mongooose.Types.ObjectId,
            ref:"Size"
        }
    ],
   
    
    mainImage: {
        type:String,
        default:""
    },

    images: {
        type:Array,
        default:[]
    },
    
    

    parentCategory: {
        type:mongooose.Schema.Types.ObjectId,
        ref:"Category",
        required:true
    },

    subCategory: {
        type:mongooose.Schema.Types.ObjectId,
        ref:"Category",
        required:true
    },

    childCategory: {
        type:mongooose.Schema.Types.ObjectId,
        ref:"Category",
        required:true
    },

    country: {
        type:String,
        default:""
    },

    brend: {
        name: {
            type:String,
        },
    
        image: {
            type:String,
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
    },

    shop: {
        type: mongooose.Schema.Types.ObjectId,
        ref: "Shop",
        required:true
    },

    seller: {
        type:mongooose.Schema.Types.ObjectId,
        ref:"User"

    },

    reviews: [
        {
          type:String,
          ref:"User"   
        }
    ],
    
}, 

{ 
  timestamps:true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
}

);



module.exports = mongooose.model("Product", Schema);
