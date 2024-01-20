const slugify = require("slugify");
const brendModel = require("../models/brend.model");
const router = require("express").Router();
const { langReplace } = require("../utils/langReplace") 
const { base64Converter } = require("../utils/base64Converter") 


router.get("/brends/:slug", async (req, res) => {
    try {
        const lang = req.headers["lang"];

        let brends = await brendModel.find({}, {name:1, discription:1, price:1, [lang]:1});
        brends = langReplace(brends, lang);

        return res.status(200).json(brends);
    } catch (error) {
        console.log(error);
    }
});



router.post("/add-brend", async(req, res) => {
    try {
        req.body.image = base64Converter(req.body.image);
        req.body.logo = base64Converter(req.body.logo);
        req.body.slug = slugify(req.body.name);

        const newBrend = await new brendModel(req.body).save();
        return res.status(201).json(newBrend);

    } catch (error) {
        console.log(error);
    }
});

router.delete("/delete-brend/:id", async (req, res) => {
    try {
        const deleteBrend = await brendModel.findByIdAndDelete(req.params.id)
        return res.status(200).json("success deleted!")
    } catch (error) {
        console.log(error);
    }
})



module.exports = router;