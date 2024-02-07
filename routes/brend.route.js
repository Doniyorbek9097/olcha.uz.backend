const slugify = require("slugify");
const brendModel = require("../models/brend.model");
const router = require("express").Router();
const langReplace  = require("../utils/langReplace"); 
const { Base64ToFile } = require("../utils/base64ToFile");
const fs = require("fs");
const path = require("path");


router.get("/brends", async (req, res) => {
    try {
        const lang = req.headers["lang"];
        let brends = await brendModel.find().populate("products")
        brends = JSON.parse(JSON.stringify(brends));
        if(!lang) return res.status(200).send(brends);
        
        brends = langReplace(brends, lang);
        return res.status(200).json(brends);
    } catch (error) {
        console.log(error);
        res.status(500).send(`server xatosi: ${error.message}`)
    }
});



router.post("/brend", async(req, res) => {
    req.body.image.uz = await new Base64ToFile(req).bufferInput(req.body.image.uz).save();
    req.body.image.ru = await new Base64ToFile(req).bufferInput(req.body.image.ru).save();
    req.body.logo = await new Base64ToFile(req).bufferInput(req.body.logo).save();
    req.body.slug = slugify(req.body.name);

    try {
        const newBrend = await new brendModel(req.body).save();
        return res.status(201).json(newBrend);

    } catch (error) {
        console.log(error);
        const { image, logo } = req.body;
        image && fs.unlink(path.join(__dirname, "../uploads", path.basename(image)), (err) => err && console.log(err));
        logo && fs.unlink(path.join(__dirname, path.basename(logo)), (err) => err && console.log(err));
    }
});



router.get("/brend/:slug", async(req, res) => {
    try {
        const { slug } = req.params;
        const { lang } = req.headers;
        let brend = await brendModel.findOne({slug: slug}).populate("categories", "name image slug").populate("products");
        brend = JSON.parse(JSON.stringify(brend));
        if(!lang) return res.status(200).json(brend);

        brend.title = langReplace(brend.title, lang);
        brend.discription = langReplace(brend.discription, lang);
        brend.image = langReplace(brend.image, lang);
        brend = langReplace(brend, lang);
        brend.categories = langReplace(brend.categories, lang);

        return res.status(200).json(brend);

    } catch (error) {
        console.log(error);
        return res.status(500).json("Serverda Xatolik");
    }
});


router.put("/brend/:slug", async(req, res) => {
    const { slug } = req.params;
    const brend = await brendModel.findOne({slug: slug});
    !req.body.image.uz && fs.unlink(path.join(__dirname, `../uploads/${path.basename(brend.image.uz)}`), (err) => err && console.log(err.message));
    req.body.image.uz = await new Base64ToFile(req).bufferInput(req.body?.image?.uz).fileName(brend.image.uz).save();
    
    !req.body.image.ru && fs.unlink(path.join(__dirname, `../uploads/${path.basename(brend.image.ru)}`), (err) => err && console.log(err.message));
    req.body.image.ru = await new Base64ToFile(req).bufferInput(req.body?.image?.ru).fileName(brend.image.ru).save();
    
    !req.body.logo && fs.unlink(path.join(__dirname, `../uploads/${path.basename(brend.logo)}`), (err) => err && console.log(err.message));
    req.body.logo = await new Base64ToFile(req).bufferInput(req.body?.logo).fileName(brend.logo).save();

    req.body.slug = slugify(req.body.name);

    try {
        const newBrend = await brendModel.findOneAndUpdate({slug:slug}, req.body);
        return res.status(200).json(newBrend);

    } catch (error) {
        console.log(error);
        const { image, logo } = req.body;
        image?.uz && fs.unlink(path.join(__dirname, "../uploads", path.basename(image.uz)), (err) => err && console.log(err));
        image?.ru && fs.unlink(path.join(__dirname, "../uploads", path.basename(image.ru)), (err) => err && console.log(err));
        logo && fs.unlink(path.join(__dirname, path.basename(logo)), (err) => err && console.log(err));
        res.status(500).send("Serverda Xatolik");
    }
});

router.delete("/brend/:id", async (req, res) => {
    try {
        const deleteBrend = await brendModel.findByIdAndDelete(req.params.id);
        const {image, logo} = deleteBrend;
        image?.uz && fs.unlink(path.join(__dirname, `../uploads/${path.basename(image.uz)}`), (err) => err && console.log(err));
        image?.ru && fs.unlink(path.join(__dirname, `../uploads/${path.basename(image.ru)}`), (err) => err && console.log(err));
        logo && fs.unlink(path.join(__dirname, `../uploads/${path.basename(logo)}`), (err) => err && console.log(err));
        return res.status(200).json("success deleted!")
    } catch (error) {
        console.log(error);
        res.status(500).send("Server xatosi: "+ error.message);
    }
})



module.exports = router;