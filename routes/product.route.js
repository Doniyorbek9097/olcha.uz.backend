const router = require("express").Router();
const productModel = require("../models/product.model");
const slugify = require("slugify");
const langReplace = require("../utils/langReplace");
const { upload } = require("../middlewares/upload");
const { uploader } = require("../middlewares/uploader");
const resizeImage = require("../utils/resizeImage")
const path = require("path")
const fs = require("fs");
const { base64Converter } = require("../utils/base64Converter");

// create new Product 
router.post("/product", async (req, res) => {
    req.body.slug = slugify(req.body.name.uz);
    req.body.images = base64Converter(req, req.body.images);

    for (const color of req.body.colors) {
            color.images = base64Converter(req, color.images);
        }
        
    try {
        
        const newProduct = await new productModel(req.body).save();
        return res.status(200).json(newProduct);

    } catch (error) {
        if(error) {
            console.log(error)
            const { colors, images } = req.body;
            if(colors.length > 0) {
                for (const color of colors) {
                    for (const image of color.images) {
                        fs.unlink(
                            path.join(__dirname, `../uploads/${path.basename(image)}`),
                            (err) => err && console.log(err)    
                        )
                    }
                }
            }

            if(images.length > 0) {
                for (const image of images) {
                    fs.unlink(
                        path.join(__dirname, `../uploads/${path.basename(image)}`),
                        (err) => err && console.log(err)    
                    )
                }
            }
            
            return res.status(500).json("serverda Xatolik")
        }
    }
});

// get all products 
router.get("/products", async (req, res) => {
    try {
        let lang = req.headers['lang'];
        let products = await productModel.find();
        if (products.length == 0) return res.json([]);
        products = JSON.stringify(products);
        products = JSON.parse(products);
        if (!lang) return res.json(products);
        products = langReplace(products, lang);
        return res.json(products);
    } catch (error) {
        console.log(error)
    }
});


// search products 
router.get("/product/:category", async (req, res) => {
    try {
        let lang = req.headers['lang'];
        let categorySlug = req.params.category;
        let products = await productModel.find()
            .populate("parentCategory")
            .populate("subCategory")
            .populate("childCategory")
            .populate("brend")

        products = products.filter(product => {
            if (product.parentCategory.slug == categorySlug) return product;
            if (product.subCategory.slug == categorySlug) return product;
            if (product.childCategory.slug == categorySlug) return product;

        })

        products = JSON.stringify(products);
        products = JSON.parse(products);
        if (!lang) return res.json({ result: products });
        products = langReplace(products, lang);
        for (const product of products) {
            // product.brend.discription = langReplace(product.brend?.discription, lang);
            product.properteis = langReplace(product.properteis, lang);
            product.parentCategory = langReplace(product.parentCategory, lang);
            product.subCategory = langReplace(product.subCategory, lang);
            product.childCategory = langReplace(product.childCategory, lang);

        }
        return res.json(products);
    } catch (error) {
        console.log(error)
    }
});



// one product by id 
router.get("/product-slug/:slug", async (req, res) => {
    try {

        let color = req.query.color || "";


        let lang = req.headers['lang'];
        let product = await productModel.findOne({ slug: req.params.slug })
            .populate("parentCategory")
            .populate("subCategory")
            .populate("childCategory")
            // .populate("shop");

        product = JSON.stringify(product);
        product = JSON.parse(product);
        if (!lang) return res.json({ result: product });

        product = langReplace(product, lang);
        product.properteis = product.properteis.map(item => langReplace(item, lang));
        product.parentCategory = langReplace(product.parentCategory, lang);
        product.subCategory = langReplace(product.subCategory, lang);
        product.childCategory = langReplace(product.childCategory, lang);
        return res.status(200).json(product)
    } catch (error) {
        console.log(error);
    }
});


// update product 
router.put("/product/:id", async (req, res) => {
    try {
        const updated = await productModel.findByIdAndUpdate(req.params.id, req.body);
        res.json({ result: updated });
    } catch (error) {

    }
});


router.delete("/product/:id", async (req, res) => {
    try {
        const deleted = await productModel.findByIdAndDelete(req.params.id);
        const {images, colors} = deleted;

        if(colors.length > 0) {
            for (const color of colors) {
                for (const image of color.images) {
                    fs.unlink(
                        path.join(__dirname, `../uploads/${path.basename(image)}`),
                        (err) => err && console.log(err)    
                    )
                }
            }
        }

        if(images.length > 0) {
            for (const image of images) {
                fs.unlink(
                    path.join(__dirname, `../uploads/${path.basename(image)}`),
                    (err) => err && console.log(err)    
                )
            }
        }
        

    
    return res.status(200).json({ result: deleted });

    } catch (error) {
        console.log(error);
        return res.status(500).json("Serverda Xatolik")
    }
});


module.exports = router;



