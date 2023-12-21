const slugify = require("slugify");

const brendModel = require("../models/brend.model");
const router = require("express").Router();

router.get("/brends", async (req, res) => {
    try {
        const brends = await brendModel.find();
        return res.status(200).json(brends);
    } catch (error) {
        console.log(error);
    }
});



router.post("/add-brend", async(req, res) => {
    try {
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