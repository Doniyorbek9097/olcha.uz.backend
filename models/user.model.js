const mongooose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt  = require("bcrypt");

const userSchema = new mongooose.Schema({
    firstname: {
        type:String,
        required:true
    },
    lastname: {
        type:String,
        default:""
    },
    phone: {
        type:Number,
        required:true
    },
    password: {
        type:String,
        required:true
    },
    email: {
        type: String,
        unique: true,
        index: true,
        lowarcase: true
    },

    isBlocked: {
        type: Boolean,
        default: false
    },

    verified: {
            type:Boolean,
            default:false
    },

    role: {
        type: String,
        default: "user",
        enum: ["user", "seller", "admin"]
    },

    address: {
        type: mongooose.Schema.Types.ObjectId,
        ref:"Address"
    }
},

    {
        timestamps: true
    }

);

userSchema.set("toObject", { virtuals: true });
userSchema.set("toJSON", { virtuals: true });

userSchema.methods.generateToken = async function () {
    const token = jwt.sign(
        {_id: this._id, email: this.email},
        process.env.JWT_PASSWORD,
        {expiresIn:"7d"}
        );

    return token;
}


userSchema.pre("save", async function(next) {
   const salt = await bcrypt.genSalt(10);
   this.password = await bcrypt.hash(this.password, salt)
});


userSchema.methods.comparePassword = async function(password) {
   return await bcrypt.compare(password, this.password)
}



userSchema.virtual("shops", {
    "ref": "Shop",
    localField: "_id",
    foreignField: "owner"
});



// userSchema.index( 
//     { created_at: 1 },
//     { expireAfterSeconds: "1d", partialFilterExpression: { verified: false } }
// )

module.exports = mongooose.model("User", userSchema);