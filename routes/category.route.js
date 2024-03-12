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
const mongooseIntl = require("mongoose-intl")


// Create new Category 
router.post("/category", async (req, res) => {
    try {
        if (!req.body.name || (!req.body.name.uz && !req.body.name.ru))
            return res.status(404).send("category name not found");
        req.body.left_banner = JSON.stringify(req.body.left_banner);
        req.body.top_banner = JSON.stringify(req.body.top_banner_banner);
        req.body.slug = slugify(req.body.name.uz)

        const newCategory = await categoryModel(req.body).save();

        if (newCategory.parent) {
            await categoryModel.updateOne(
                { _id: newCategory.parent },
                { $push: { children: newCategory.id } }
            );
        }


        return res.status(201).json(newCategory)

    } catch (error) {
        return res.status(500).json("server ishlamayapti")
    }
});



// Get all category
router.get("/category", async (req, res) => {
    try {
        const lang = req.headers["lang"];
        let page = parseInt(req.query.page) - 1 || 0;
        let limit = parseInt(req.query.limit) || 1;
        let search = req.query.search || "";

        let categories = await categoryModel.find()
            .populate({
                path: "children",
                populate: {
                    path: "children"
                }
            })
            .populate({
                path: "parent",
                populate: {
                    path: "parent"
                }
            })
            .populate({
                path: "parentProducts",
            })
            .populate("subProducts")
            .populate("childProducts")
            .populate("brendId")

            .sort({ createdAt: -1 })


        categories = JSON.parse(JSON.stringify(categories));
        if (!lang) return res.json(categories);

        categories = langReplace(categories, lang);

        for (const category of categories) {
            category?.parent && (category.parent = langReplace(category?.parent, lang));
            category?.parent?.parent && (category.parent.parent = langReplace(category.parent.parent, lang));

            category.children = langReplace(category.children, lang);
            category.parentProducts = langReplace(category.parentProducts, lang);
            category.subProducts = langReplace(category.subProducts, lang);
            category.childProducts = langReplace(category.childProducts, lang);
            category.left_banner = langReplace(category.left_banner, lang);
            category.top_banner = langReplace(category.top_banner, lang);

            for (const subCategory of category.children) {
                subCategory.children = langReplace(subCategory.children, lang);
            }
        }


        return res.json(categories);
    } catch (err) {
        if (err) {
            console.log(err)
            res.status(500).json("server ishlamayapti")
        }
    }
});




// Get prent all category
router.get("/categories", async (req, res) => {
    try {
        const lang = req.headers["lang"];
        categoryModel.setDefaultLanguage(lang);

        let page = parseInt(req.query.page) - 1 || 0;
        let limit = parseInt(req.query.limit) || 1;
        let search = req.query.search || "";

        let categories = await categoryModel.find()
            .populate({
                path: "children",
                populate: {
                    path: "children"
                }
            })
            .populate({
                path: "parent",
                populate: {
                    path: "parent"
                }
            })
            .populate({
                path: "parentProducts",
            })
            .populate("carousel")
            .populate("subProducts")
            .populate("childProducts")
            .populate("brendId");


        return res.json(categories);
    } catch (err) {
        if (err) {
            console.log(err)
            res.status(500).json("server ishlamayapti")
        }
    }
});









// Get by slug name 
router.get("/category-slug/:slug", async (req, res) => {
    try {
        const lang = req.headers["lang"];
        categoryModel.setDefaultLanguage(lang);

        let page = parseInt(req.query?.page) - 1 || 0;
        let limit = parseInt(req.query?.limit) || 2;
        let search = req.query?.search || "";
        let product = await categoryModel.findOne({ slug: req.params.slug }).populate("parentProducts").populate("subProducts").populate("childProducts");
        const productLenth = [...product?.parentProducts, ...product?.subProducts, ...product?.childProducts];

        let category = await categoryModel.findOne({ slug: req.params.slug })
            .populate({
                path: "children",
                populate: {
                    path: "children"
                }
            })
            .populate({
                path: "parent",
                populate: {
                    path: "parent"
                }
            })

            .populate({
                path: "parentProducts",
                limit: limit,
                sort: { createdAt: -1 },
                skip: page * limit
            })
            .populate({
                path: "subProducts",
                limit: limit,
                sort: { createdAt: -1 },
                skip: page
            })
            .populate({
                path: "childProducts",
                limit: limit,
                sort: { createdAt: -1 },
                skip: page
            })
            .populate("brendId")

            return res.status(200).json({
            totalPage: Math.ceil(productLenth.length / limit),
            page: page + 1,
            limit,
            category
        });
    } catch (error) {
        if (error) {
            console.log(error);
            res.status(500).json("server ishlamayapti")
        }
    }
})


// Get byId Category 
router.get("/category/:id", async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(404).send("Category Id haqiqiy emas");
        }
        
        let category = await categoryModel.findById(req.params.id);
        if (!category) return res.status(404).send("Category topilmadi");
        category = category.toObject();
        console.log(category.left_banner);
        // category.left_banner = JSON.parse(category.left_banner);
        // category.top_banner = JSON.parse(category.top_banner);

        return res.status(200).json(category);
    } catch (error) {
        console.log(error)
        res.status(500).send(error.message)
    }
})



// Edit Category 
router.put("/category/:id", async (req, res) => {
    const { image, left_banner, top_banner } = req.body;
    let category = await categoryModel.findById(req.params.id);
    category = category.toObject();
    !req.body.image && fs.unlink(path.join(__dirname, `../uploads/${category.image}`), (err) => err && console.log(err.message))
    req.body.image = await new Base64ToFile(req).bufferInput(image).fileName(category.image).save();
    // left banner updated 
    
    const findLeft = await category?.left_banner.find(banner => banner);

    for (const banner of req.body.left_banner) {
        // !banner.image.uz && fs.unlink(path.join(__dirname, `../uploads/${banner.image.uz}`), (err) => err && console.log(err.message));
        // !banner.image.ru && fs.unlink(path.join(__dirname, `../uploads/${banner.image.ru}`), (err) => err && console.log(err.message));
        // banner.image.uz = await new Base64ToFile(req).bufferInput(banner?.image.uz).fileName(findLeft?.image.uz).save();
        // banner.image.ru = await new Base64ToFile(req).bufferInput(banner?.image.ru).fileName(findLeft?.image.ru).save();
        banner.slug = banner.slug;
    }

    // left banner updated end

    // top banner updated
    const findTop = await category?.top_banner;

    for (const i in req.body.top_banner) {
        // !top_banner[i].image.uz && fs.unlink(path.join(__dirname, `../uploads/${findTop[i]?.image.uz}`), (err) => err && console.log(err.message));
        // !top_banner[i].image.ru && fs.unlink(path.join(__dirname, `../uploads/${findTop[i]?.image.ru}`), (err) => err && console.log(err.message));
        // top_banner[i].image.uz = await new Base64ToFile(req).bufferInput(top_banner[i].image.uz).fileName(findTop[i]?.image.uz).save();
        // top_banner[i].image.ru = await new Base64ToFile(req).bufferInput(top_banner[i].image.ru).fileName(findTop[i]?.image.ru).save();
        top_banner[i].slug = slugify(top_banner[i].slug);
    }

    // top banner updated end

    req.body.left_banner = JSON.stringify(req.body.left_banner) 
    try {
        const upadted = await categoryModel.findByIdAndUpdate(req.params.id, req.body);
        return res.status(200).json(upadted);

    } catch (error) {
        if (error) {
            // if (image) {
            //     const imagePath = path.join(__dirname, `../uploads/${path.basename(image)}`);
            //     fs.unlink(imagePath, (err) => err && console.log(err));
            // }


            // for (const banner of left_banner) {
            //     if (banner) {
            //         const bannerUzPath = path.join(__dirname, `../uploads/${path.basename(banner.image.uz)}`);
            //         const bannerRuPath = path.join(__dirname, `../uploads/${path.basename(banner.image.ru)}`);
            //         fs.unlink(bannerUzPath, (err) => err && console.log(err));
            //         fs.unlink(bannerRuPath, (err) => err && console.log(err));
            //     }
            // }

            // for (const banner of top_banner) {
            //     if (banner) {
            //         const bannerUzPath = path.join(__dirname, `../uploads/${path.basename(banner.image.uz)}`);
            //         const bannerRuPath = path.join(__dirname, `../uploads/${path.basename(banner.image.ru)}`);
            //         fs.unlink(bannerUzPath, (err) => err && console.log(err));
            //         fs.unlink(bannerRuPath, (err) => err && console.log(err));
            //     }
            // }


            return res.status(500).json("server ishlamayapti")
        }
    }
});


// Delete Category 
router.delete("/category/:id", async (req, res) => {
    try {
        const allCategoies = [];
        let parentDeleted = await categoryModel.findByIdAndDelete(req.params.id);
        parentDeleted = parentDeleted.toObject();
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