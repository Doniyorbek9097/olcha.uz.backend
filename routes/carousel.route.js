const carouselModel = require("../models/carousel.model");
const slugify = require("slugify");
const { base64Converter } = require("../utils/base64Converter");
const resizeImage = require("../utils/resizeImage");
const path = require("path");
const fs = require("fs");

const router = require("express").Router();

router.post("/carousel", async(req, res)=> {
    req.body.slug = slugify(req.body.slug);
    req.body.image.uz = base64Converter(req.body.image.uz)?.url;
    req.body.image.ru = base64Converter(req.body.image.ru)?.url;

    try {        
        const result = await new carouselModel(req.body).save();
        return res.status(200).json(result);
    } catch (error) {

        if(error) {
         const { image } = req.body;
            if(image.uz) {
                fs.unlink(
                    path.join(__dirname, `../uploads/${path.basename(image.uz)}`),
                    (err) => err && console.log(err)
                )
            }

            if(image.ru) {
                fs.unlink(
                    path.join(__dirname, `../uploads/${path.basename(image.uz)}`),
                    (err) => err && console.log(err)
                )
            }

        }
    }
});


router.get("/carousel", async(req,res) => {
    try {
        let result = await carouselModel.find();
        const lang = req.headers["lang"];
        result = Array.from(result);
        if(!lang) return res.json({result});
        result = result.map(item => ({
            image:item.image[lang],
            slug: item.slug[lang]
        }));
        
       return res.json(result);
    } catch (error) {
        console.log(error)
    }
});


router.delete("/carousel/:id", async(req,res) => {
    try {
        const result = await carouselModel.findByIdAndDelete(req.params.id);
        res.json({result})
    } catch (error) {
        console.log(error)
    }
})


module.exports = router;