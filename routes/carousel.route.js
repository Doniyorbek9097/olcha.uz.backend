const carouselModel = require("../models/carousel.model");
const slugify = require("slugify");
const { base64Converter } = require("../utils/base64Converter");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const langReplace = require("../utils/langReplace");

const router = require("express").Router();

router.post("/carousel", async(req, res)=> {
    const { image, slug } = req.body;
    req.body.slug = slugify(slug);
    image && (req.body.image.uz = base64Converter(req, image.uz));
    image && (req.body.image.ru = base64Converter(req, image.ru));

    try {        
        const result = await new carouselModel(req.body).save();
        return res.status(200).json(result);

    } catch (error) {
         const { image } = req.body;
            if(image && image.uz) {
                fs.unlink(
                    path.join(__dirname, `../uploads/${path.basename(image.uz)}`),
                    (err) => err && console.log(err)
                )
            }

            if(image && image.ru) {
                fs.unlink(
                    path.join(__dirname, `../uploads/${path.basename(image.uz)}`),
                    (err) => err && console.log(err)
                )
            }

        }
});


router.get("/carousel", async(req,res) => {
    try {
        let result = await carouselModel.find();
        const lang = req.headers["lang"];
        result = JSON.stringify(result);
        result = JSON.parse(result);
        if(!lang) return res.status(200).json(result);

        result = langReplace(result, lang);
       return res.status(200).json(result);

    } catch (error) {
        console.log(error);
        res.status(500).send(error.message)
    }
});


router.delete("/carousel/:id", async(req,res) => {
    try {
        
        if(!mongoose.isValidObjectId(req.params.id)) return res.status(404).send("Carousel topilmadi");
        const result = await carouselModel.findByIdAndDelete(req.params.id);
        if(!result) return res.status(404).send("Carousel Topilmadi");

        const { image } = result;

        if(image && image.uz) {
            fs.unlink(
                path.join(__dirname, `../uploads/${path.basename(image.uz)}`),
                (err) => err && console.log(err)
            )
        }

        if(image && image.ru) {
            fs.unlink(
                path.join(__dirname, `../uploads/${path.basename(image.ru)}`),
                (err) => err && console.log(err)
            )
        }


        res.status(200).json(result);

    } catch (error) {
        console.log(error)
        res.status(500).send(error.message)
    }
})


module.exports = router;