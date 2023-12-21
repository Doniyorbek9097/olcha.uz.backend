const router = require("express").Router();
const slugify = require("slugify");
const fs = require("fs");
const categoryModel = require("../models/category.model");
const langReplace = require("../utils/langReplace");
const nestedCategories = require("../utils/nestedCategories");

// Create new Category 
router.post("/category", async (req, res) => {
    try {
        req.body.slug = slugify(req.body.name.uz);
        
        const category = await categoryModel(req.body).save();
        res.json(category)
    } catch (error) {
        console.log(error)
    }
});



// Get all category
router.get("/category", async (req, res) => {
    try {
        const lang = req.headers["lang"];
        let length = await categoryModel.countDocuments();

        let page = parseInt(req.query.page) - 1 || 0;
        let limit = parseInt(req.query.limit) || 10;
        let search = req.query.search || "";

        let categories = await categoryModel.find({
            slug:{ $regex: search, $options: "i" }
        }).populate("products");
        let categoryList = nestedCategories(categories);
        categoryList = JSON.stringify(categoryList);
        categoryList = JSON.parse(categoryList);
        if(!lang) return res.json( categoryList );

        categoryList = langReplace(categoryList, lang);
        
        for (const category of categoryList) {
            category.children = langReplace(category.children, lang);
            category.products = langReplace(category.products, lang);
            for (const subCategory of category.children) {
                subCategory.children = langReplace(subCategory.children, lang);
            }
        }

        return res.json( categoryList );
    } catch (err) {
        console.log(err);
    }
});





// Get byId Category 
router.get("/category/:slug", async (req, res) => {
    try {
        const lang = req.headers["lang"];
        let category = await categoryModel.findOne({ slug:req.params.slug }).populate("products");
        if(!lang) return res.json({ result: category });
        category = JSON.stringify(category);
        category = JSON.parse(category);
        category = langReplace(category, lang);
        category.products = langReplace(category.products, lang);
        
       return res.json(category);
    } catch (error) {

    }
})

// Edit Category 
router.put("/category/:id", async (req, res) => {
    try {
        req.body.slug = slugify(req.body.name.uz);
        const upadted = await categoryModel.findByIdAndUpdate(req.params.id, req.body);
        res.json({ result: upadted });
    } catch (error) {
        console.log(error);
    }
});


// Delete Category 
router.delete("/category/:id", async (req, res) => {
    try {
        const deleted = await categoryModel.findByIdAndDelete(req.params.id);
        res.json({ result: deleted });
    } catch (error) {

    }
})





module.exports = router;