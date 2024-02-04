const mongooose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt  = require("bcrypt");

const userSchema = new mongooose.Schema({
    firstname: {
        type:String,
    },
    lastname: {
        type:String,
    },

    username: {
        type: String,
        default:""
    },

    phone_number: {
        type:String,
        required:true
    },
    password: {
        type:String,
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
        {   _id: this._id, 
            phone_number: this.phone_number
        },
        process.env.JWT_SECRET_KEY,
        {expiresIn:"7d"}
    );

    return token;
}


userSchema.pre("save", async function(next) {
    if(this.password) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt)
    }

    if(this.firstname && this.lastname) {
        this.username = `${this.firstname}_${this.lastname}`;
    }
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