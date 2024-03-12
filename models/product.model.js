const mongoose = require("mongoose");

const Schema = mongoose.Schema({
    name: {
        type: String,
        intl: true
    },

    slug: {
        type:String,
        required:true
    },

    discription: {
        type: String,
        intl: true
    },

    properteis: [
        {
            type: String,
            intl: true
        }
    ],


    countInStock: {
        type: Number,
        min: 1    
    },

    orginal_price: {
        type:Number,
        required:true
    },

    sale_price: {
        type: Number,
        required: true
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

    discount: {
        type: Number
    }
    
}, 

{ 
  timestamps:true,
  toJSON: { virtuals: true }
}

);


Schema.pre("save", async function(next) {
    this.discount = parseInt(((this.orginal_price - this.sale_price) / this.orginal_price) * 100); 
})



module.exports = mongoose.model("Product", Schema);
