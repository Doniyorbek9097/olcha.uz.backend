const carouselModel = require("../models/carousel.model");
const slugify = require("slugify");

const router = require("express").Router();

router.post("/carousel", async(req, res)=> {
    try {
        req.body.slug = slugify(req.body.slug);
        const result = await new carouselModel(req.body).save();
        res.json({result});
    } catch (error) {
        console.log(error)
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
        
       return res.json({result});
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