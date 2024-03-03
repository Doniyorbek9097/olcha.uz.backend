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
const fs = require("fs");


const array1 = [{ name: "john" }];
const array2 = [{ name: "jon" }];

const areArraysEqual =  array1.every((item, index) => item.name === array2[index].name);
console.log(areArraysEqual); // false



app.use(cors());
app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));
app.use("/uploads", express.static("uploads"))
routes.forEach(route => app.use("/", route));





const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server is runinng on port ${PORT}`))




