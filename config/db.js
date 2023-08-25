const mongoose = require("mongoose");

const connectDB = async () => {
    try {
      const connect =  await mongoose.connect(process.env.MONGO_URL,  { useNewUrlParser: true });
      console.log("MongoDb connect")
    } catch (error) {
        console.log(error)
    }   
}

connectDB();