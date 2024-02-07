const router = require("express").Router();
const productModel = require("../models/product.model");
const slugify = require("slugify");
const langReplace = require("../utils/langReplace");
const path = require("path")
const fs = require("fs");
const { Base64ToFile } = require("../utils/base64ToFile");

// create new Product 
router.post("/product", async (req, res) => {
    const { images } = req.body;
    req.body.slug = slugify(req.body.name.uz);
    req.body.images = [];

    for (const image of images) {
        const data = await new Base64ToFile(req).bufferInput(image).save();
        req.body.images.push(data);
    }


    // for (const color of req.body.colors) {
    //         color.images =  await new Base64ToFile(req).bufferInput(color.images).save();
    //     }

    try {

        const newProduct = await new productModel(req.body).save();
        return res.status(200).json(newProduct);

    } catch (error) {
        console.log(error);
        const { images } = req.body;
        // if(colors?.length > 0) {
        //     for (const color of colors) {
        //         for (const image of color.images) {
        //             fs.unlink(
        //                 path.join(__dirname, `../uploads/${path.basename(image)}`),
        //                 (err) => err && console.log(err)    
        //             )
        //         }
        //     }
        // }

        if (images?.length > 0) {
            for (const image of images) {
                fs.unlink(
                    path.join(__dirname, `../uploads/${path.basename(image)}`),
                    (err) => err && console.log(err)
                )
            }
        }

        return res.status(500).json("serverda Xatolik")
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
// router.get("/product/:category", async (req, res) => {
//     try {
//         let lang = req.headers['lang'];
//         let categorySlug = req.params.category;
//         let products = await productModel.find()
//             .populate("parentCategory")
//             .populate("subCategory")
//             .populate("childCategory")
//             .populate("brend")

//         products = products.filter(product => {
//             if (product.parentCategory.slug == categorySlug) return product;
//             if (product.subCategory.slug == categorySlug) return product;
//             if (product.childCategory.slug == categorySlug) return product;

//         })

//         products = JSON.stringify(products);
//         products = JSON.parse(products);
//         if (!lang) return res.json({ result: products });
//         products = langReplace(products, lang);
//         for (const product of products) {
//             // product.brend.discription = langReplace(product.brend?.discription, lang);
//             product.properteis = langReplace(product.properteis, lang);
//             product.parentCategory = langReplace(product.parentCategory, lang);
//             product.subCategory = langReplace(product.subCategory, lang);
//             product.childCategory = langReplace(product.childCategory, lang);

//         }
//         return res.json(products);
//     } catch (error) {
//         console.log(error)
//     }
// });



// one product by slug
router.get("/product-slug/:slug", async (req, res) => {
    try {

        let color = req.query.color || "";


        let lang = req.headers['lang'];
        let product = await productModel.findOne({ slug: req.params.slug })
            .populate("parentCategory")
            .populate("subCategory")
            .populate("childCategory")
            .populate("brend")
        // .populate("shop");

        product = JSON.parse(JSON.stringify(product));
        if (!lang) return res.json({ result: product });

        product = langReplace(product, lang);
        product.properteis = product.properteis.flatMap(item => item[lang]);
        product.parentCategory = langReplace(product.parentCategory, lang);
        product.subCategory = langReplace(product.subCategory, lang);
        product.childCategory = langReplace(product.childCategory, lang);
        return res.status(200).json(product)
    } catch (error) {
        console.log(error);
    }
});



// one product by id 
router.get("/product/:id", async (req, res) => {
    try {

        let color = req.query.color || "";

        let product = await productModel.findById(req.params.id)
            .populate("parentCategory")
            .populate("subCategory")
            .populate("childCategory")
            .populate("brend")

        // .populate("shop");

        return res.status(200).json(product)
    } catch (error) {
        console.log(error);
    }
});



// update product 
router.put("/product/:id", async (req, res) => {
    const id = req.params.id;
    req.body.slug = slugify(req.body.name.uz);
    req.body.discount = parseInt(((req.body.orginal_price - req.body.sale_price) / req.body.orginal_price) * 100);

    try {
        const updated = await productModel.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).json(updated);
    } catch (error) {
        console.log(error);
        res.status(500).send("Server Xatosi: "+ error);
    }
});


router.delete("/product/:id", async (req, res) => {
    try {
        const deleted = await productModel.findByIdAndDelete(req.params.id);
        const { images, colors } = deleted;

        if (colors.length > 0) {
            for (const color of colors) {
                for (const image of color.images) {
                    fs.unlink(
                        path.join(__dirname, `../uploads/${path.basename(image)}`),
                        (err) => err && console.log(err)
                    )
                }
            }
        }

        if (images.length > 0) {
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



