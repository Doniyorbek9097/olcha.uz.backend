const router = require("express").Router();
const productModel = require("../models/product.model");
const slugify = require("slugify");


// create new Product 
router.post("/product", async (req, res) => {
    try {
        let product = req.body;
        req.body.slug = {
            uz: slugify(product.name.uz),
            ru: slugify(product.name.ru)
        };

        const savedproduct = await productModel(req.body).save();
        res.json({ result: savedproduct })
    } catch (error) {
        console.log(error)
    }
});

// get all products 
router.get("/product", async (req, res) => {
    try {
        let lang = req.headers['lang'];
        console.log(lang)
        let products = await productModel.find()
        products = JSON.stringify(products);
        products = JSON.parse(products);
        if (!lang) return res.json({ result: products });
        for (const product of products) {
            product.name = product.name[lang];
            product.slug = product.slug[lang];
            product.discription = product.discription[lang];
            product.brend.discription = product?.brend?.discription[lang];
            product.richDescription = product?.richDescription[lang];
            product.properteis = product.properteis.map(item => item[lang]);
            
        }

        res.json({ result: products });
    } catch (error) {
        console.log(error)
    }
});


// one product by id 
router.get("/product/:id", async (req, res) => {
    try {
        let lang = req.headers['lang'];
        let product = await productModel.findOne({_id:req.params.id})
            .populate("parentCategory")
            .populate("subCategory")
            .populate("childCategory")
            .populate("shop")

        product = JSON.stringify(product);
        product = JSON.parse(product);
        if (!lang) return res.json({ result: product });
        product.name = product.name[lang];
        product.discription = product.discription[lang];
        product.brend.discription = product?.brend?.discription[lang];
        product.richDescription = product?.richDescription[lang];
        product.properteis = product.properteis.map(item => item[lang]);

        res.json({ result: product })
    } catch (error) {

    }
});


// update product 
router.put("/product/:id", async (req, res) => {
    try {
        req.body.slug = slugify(req.body.name?.uz);
        const updated = await productModel.findByIdAndUpdate(req.params.id, req.body).populate('parentCategory');
        res.json({ result: updated });
    } catch (error) {

    }
});


router.delete("/product/:id", async (req, res) => {
    try {
        const deleted = await productModel.findByIdAndDelete(req.params.id);
        res.json({ result: deleted });
    } catch (error) {

    }
});


module.exports = router;



