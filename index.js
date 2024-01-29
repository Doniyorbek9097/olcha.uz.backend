const express = require("express");
const cors = require("cors");
var bodyParser = require('body-parser');
require("dotenv/config");
require("./config/db");
const routes = require("./routes");
const app = express();
const i18n = require("./locales");
const path = require("path");
const { isEqual } = require("./utils/isEqual");


app.use(cors());

// const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
// const ffmpeg = require('fluent-ffmpeg');
// ffmpeg.setFfmpegPath(ffmpegPath);

  
// app.use("/", (req, res) => {
//     console.log(resizeImage(req, "./kiym-ayol-uz1.png", 200, 400))
// })

app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));
app.use("/uploads", express.static("uploads"))
routes.forEach(route => app.use("/", route));





const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server is runinng on port ${PORT}`))
