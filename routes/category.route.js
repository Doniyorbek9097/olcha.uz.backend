const router = require("express").Router();
const slugify = require("slugify");
const categoryModel = require("../models/category.model");
const langReplace = require("../utils/langReplace");
const nestedCategories = require("../utils/nestedCategories");
const { base64Converter } = require("../utils/base64Converter");
const resizeImage = require("../utils/resizeImage");
const path = require("path");
const fs = require("fs");

// Create new Category 
router.post("/category", async (req, res) => {
const {name, image, icon, left_banner, top_banner } = req.body;

    req.body.slug = slugify(name.uz);
    image && (req.body.image = base64Converter(req, image)?.url);

    if (left_banner && left_banner.length > 0) {
        for (const banner of left_banner) {
            banner.image.uz = base64Converter(req, banner.image.uz)?.url;
            banner.image.ru = base64Converter(req, banner.image.ru)?.url;
        }
    }

    if(top_banner && top_banner.length > 0) {
        for (const banner of top_banner) {
            banner.image.uz = base64Converter(req, banner.image.uz)?.url;
            banner.image.ru = base64Converter(req, banner.image.ru)?.url;
        }
    }

    try {
        const newCategory = await categoryModel(req.body).save();
        res.json(newCategory)

    } catch (error) {
        if (error) {

            if (image) {
                const imagePath = path.join(__dirname, `../uploads/${path.basename(image)}`);
                fs.unlink(imagePath, (err) => err && console.log(err));
            }

            if (icon) {
                const iconPath = path.join(__dirname, `../uploads/${path.basename(icon)}`);
                fs.unlink(iconPath, (err) => err && console.log(err));
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
router.get("/category/:slug", async (req, res) => {
    try {
        const lang = req.headers["lang"];
        let category = await categoryModel.findOne({ slug: req.params.slug });
        if (!lang) return res.json({ result: category });
        category = JSON.stringify(category);
        category = JSON.parse(category);
        category = langReplace(category, lang);
        category.products = langReplace(category.products, lang);

        return res.json(category);
    } catch (error) {
        if (error) {
            console.log(error);
            res.status(500).json("server ishlamayapti")
        }
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
        const allCategoies = [];
        const parentDeleted = await categoryModel.findByIdAndDelete(req.params.id);
        if(!parentDeleted) return res.status(404).json("Category not found");
        const subDeleted = parentDeleted && await categoryModel.findOneAndDelete({parentId: parentDeleted._id});
        const childDeleted = subDeleted && await categoryModel.findOneAndDelete({parentId: subDeleted._id});
        allCategoies.push(parentDeleted, subDeleted, childDeleted);

        for (const cate of allCategoies) {
            if (cate && cate.image) {
            const imagePath = path.join(__dirname, `../uploads/${path.basename(cate.image)}`);
            fs.unlink(imagePath, (err) => err && console.log(err));
        }
        

        if(cate && cate.cateleft_banner?.length) {
            for (const banner of cate.left_banner) {
                const bannerUzPath = path.join(__dirname, `../uploads/${path.basename(banner.image.uz)}`);
                const bannerRuPath = path.join(__dirname, `../uploads/${path.basename(banner.image.ru)}`);
                fs.unlink(bannerUzPath, (err) => err && console.log(err));
                fs.unlink(bannerRuPath, (err) => err && console.log(err));
            }
        }
        
        if(cate && cate.top_banner?.length) {
            for (const banner of cate.top_banner) {
                const bannerUzPath = path.join(__dirname, `../uploads/${path.basename(banner.image.uz)}`);
                const bannerRuPath = path.join(__dirname, `../uploads/${path.basename(banner.image.ru)}`);
                fs.unlink(bannerUzPath, (err) => err && console.log(err));
                fs.unlink(bannerRuPath, (err) => err && console.log(err));
            }
        }
        
    }
    

        res.json({ result: parentDeleted });

    } catch (error) {
        console.log(error);
        res.status(500).json("category o'chirib bo'lmadi")
    }
})





module.exports = router;