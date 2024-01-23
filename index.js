const express = require("express");
const cors = require("cors");
var bodyParser = require('body-parser');
require("dotenv/config");
require("./config/db");
const routes = require("./routes");
const app = express();
const i18n = require("./locales");
const path = require("path")
const  resizeImage  = require("./utils/resizeImage")
app.use(cors());

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);


const inputImagePath = 'input.jpg';
const outputImagePath = 'output.jpg';
const backgroundColor = 'white'; // or any other valid color
ffmpeg()
  .input(inputImagePath)
  .inputFormat('image2')
  .videoCodec('libx264') // codec-ni o'zgartiring
  .complexFilter(`color=${backgroundColor}[bg]; [0:v][bg]overlay=0:0`)
  .output(outputImagePath)
  .on('end', () => {
    console.log('Rasm o\'zgargan');
  })
  .on('error', (err) => {
    console.error('Xatolik:', err);
  })
  .run();
  
app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));
app.use("/uploads", express.static("uploads"))
routes.forEach(route => app.use("/", route));





const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server is runinng on port ${PORT}`))
