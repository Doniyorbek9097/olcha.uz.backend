const router = require("express").Router();
const slugify = require("slugify");
const mongoose = require("mongoose");
const categoryModel = require("../models/category.model");
const langReplace = require("../utils/langReplace");
const nestedCategories = require("../utils/nestedCategories");
const { Base64ToFile } = require("../utils/base64ToFile");
const { isEqual } = require("../utils/isEqual");
const path = require("path");
const fs = require("fs");

// Create new Category 
router.post("/category", async (req, res) => {
    try {
        if (!req.body.name || (!req.body.name.uz && !req.body.name.ru))
            return res.status(404).send("category name not found");
        const newCategory = await categoryModel({
            name: req.body.name

        }).save();
        return res.status(201).json(newCategory)

    } catch (error) {
        return res.status(500).json("server ishlamayapti")
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

        let categories = await categoryModel.find().populate("products")
        let categoryList = nestedCategories(categories);
        categoryList = JSON.stringify(categoryList);
        categoryList = JSON.parse(categoryList);
        if (!lang) return res.json(categoryList);

        categoryList = langReplace(categoryList, lang);

        for (const category of categoryList) {
            category.children = langReplace(category.children, lang);
            category.products = langReplace(category.products, lang);
            category.left_banner = langReplace(category.left_banner, lang);
            category.top_banner = langReplace(category.top_banner, lang);

            for (const subCategory of category.children) {
                subCategory.children = langReplace(subCategory.children, lang);
            }
        }

        return res.json(categoryList);
    } catch (err) {
        if (err) {
            console.log(err)
            res.status(500).json("server ishlamayapti")
        }
    }
});





// Get byId Category 
router.get("/category/:id", async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(404).send("Category Id haqiqiy emas");
        }
        const category = await categoryModel.findById(req.params.id);
        if (!category) return res.status(404).send("Category topilmadi");
        return res.status(200).json(category);
    } catch (error) {
        console.log(error)
        res.status(500).send(error.message)
    }
})





// Get by slug name 
router.get("/category/:slug", async (req, res) => {
    try {
        const lang = req.headers["lang"];
        let category = await categoryModel.findOne({ slug: req.params.slug });
        if (!category) return res.status(404).send("Category topilmadi")
        if (!lang) return res.status(200).json({ result: category });
        category = JSON.stringify(category);
        category = JSON.parse(category);
        category = langReplace(category, lang);
        category.products = langReplace(category.products, lang);

        return res.status(200).json(category);
    } catch (error) {
        if (error) {
            console.log(error);
            res.status(500).json("server ishlamayapti")
        }
    }
})

// Edit Category 
router.put("/category/:id", async (req, res) => {
    const { image, left_banner, top_banner } = req.body;
    const category = await categoryModel.findById(req.params.id);

    req.body.image = await new Base64ToFile(req).bufferInput(image).fileName(category.image).save();
    // left banner updated 
    const findLeft = await category?.left_banner.find(banner => banner);

    for (const banner of left_banner) {
        banner.image.uz = await new Base64ToFile(req).bufferInput(banner?.image.uz).fileName(findLeft?.image.uz).save();
        banner.image.ru = await new Base64ToFile(req).bufferInput(banner?.image.ru).fileName(findLeft?.image.ru).save();
        banner.slug = banner.slug;
    }

    // left banner updated end

    // top banner updated
    const findTop = await category?.top_banner;

    for (const i in top_banner) {
        top_banner[i].image.uz = await new Base64ToFile(req).bufferInput(top_banner[i].image.uz).fileName(findTop[i]?.image.uz).save();
        top_banner[i].image.ru = await new Base64ToFile(req).bufferInput(top_banner[i].image.ru).fileName(findTop[i]?.image.ru).save();
        top_banner[i].slug = slugify(top_banner[i].slug);
    }

    // top banner updated end


    try {
        const upadted = await categoryModel.findByIdAndUpdate(req.params.id, req.body);
        return res.status(200).json(upadted);

    } catch (error) {
        if (error) {
            if (image) {
                const imagePath = path.join(__dirname, `../uploads/${path.basename(image)}`);
                fs.unlink(imagePath, (err) => err && console.log(err));
            }


            for (const banner of left_banner) {
                if (banner) {
                    const bannerUzPath = path.join(__dirname, `../uploads/${path.basename(banner.image.uz)}`);
                    const bannerRuPath = path.join(__dirname, `../uploads/${path.basename(banner.image.ru)}`);
                    fs.unlink(bannerUzPath, (err) => err && console.log(err));
                    fs.unlink(bannerRuPath, (err) => err && console.log(err));
                }
            }

            for (const banner of top_banner) {
                if (banner) {
                    const bannerUzPath = path.join(__dirname, `../uploads/${path.basename(banner.image.uz)}`);
                    const bannerRuPath = path.join(__dirname, `../uploads/${path.basename(banner.image.ru)}`);
                    fs.unlink(bannerUzPath, (err) => err && console.log(err));
                    fs.unlink(bannerRuPath, (err) => err && console.log(err));
                }
            }


            return res.status(500).json("server ishlamayapti")
        }
    }
});


// Delete Category 
router.delete("/category/:id", async (req, res) => {
    try {
        const allCategoies = [];
        const parentDeleted = await categoryModel.findByIdAndDelete(req.params.id);
        if (!parentDeleted) return res.status(404).json("Category not found");
        const subDeleted = parentDeleted && await categoryModel.findOneAndDelete({ parentId: parentDeleted._id });
        const childDeleted = subDeleted && await categoryModel.findOneAndDelete({ parentId: subDeleted._id });
        allCategoies.push(parentDeleted, subDeleted, childDeleted);

        for (const cate of allCategoies) {
            if (cate && cate.image) {
                const imagePath = path.join(__dirname, `../uploads/${path.basename(cate.image)}`);
                fs.unlink(imagePath, (err) => err && console.log(err));
            }


            if (cate && cate.left_banner?.length) {
                for (const banner of cate.left_banner) {
                    const bannerUzPath = path.join(__dirname, `../uploads/${path.basename(banner.image.uz)}`);
                    const bannerRuPath = path.join(__dirname, `../uploads/${path.basename(banner.image.ru)}`);
                    fs.unlink(bannerUzPath, (err) => err && console.log(err));
                    fs.unlink(bannerRuPath, (err) => err && console.log(err));
                }
            }

            if (cate && cate.top_banner?.length) {
                for (const banner of cate.top_banner) {
                    const bannerUzPath = path.join(__dirname, `../uploads/${path.basename(banner.image.uz)}`);
                    const bannerRuPath = path.join(__dirname, `../uploads/${path.basename(banner.image.ru)}`);
                    fs.unlink(bannerUzPath, (err) => err && console.log(err));
                    fs.unlink(bannerRuPath, (err) => err && console.log(err));
                }
            }

        }


        res.status(200).json(parentDeleted);

    } catch (error) {
        console.log(error);
        res.status(500).json("category o'chirib bo'lmadi")
    }
})





module.exports = router;