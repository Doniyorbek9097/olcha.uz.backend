const mongoose = require("mongoose");
const mongooseIntl = require('mongoose-intl');
mongoose.plugin(mongooseIntl, { languages: ['uz', 'ru'], defaultLanguage: 'uz', fallback: true });

const connectDB = async () => {
    try {
      const connect =  await mongoose.connect(process.env.MONGO_URL,  { useNewUrlParser: true });
      console.log("MongoDb connect")
    } catch (error) {
        console.log(error)
    }   
}

connectDB();