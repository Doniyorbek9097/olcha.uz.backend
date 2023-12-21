const router = require("express").Router();
const productModel = require("../models/product.model");
const slugify = require("slugify");
const langReplace = require("../utils/langReplace");


// create new Product 
router.post("/product", async (req, res) => {
    try {
        req.body.slug = slugify(req.body.name.uz);
        const savedproduct = await new productModel(req.body);
        const imgIndex =  savedproduct.images.indexOf(savedproduct.mainImage);
        console.log(imgIndex);
        savedproduct.images.splice(imgIndex, 1);
        savedproduct.images.unshift(savedproduct.mainImage);
        const data = await savedproduct.save();
       return res.status(201).json( data );

    } catch (error) {
        console.log(error)
    }
});

// get all products 
router.get("/products", async (req, res) => {
    try {
        let lang = req.headers['lang'];
        let products = await productModel.find();
        if(products.length == 0) return res.json([]);
        products = JSON.stringify(products);
        products = JSON.parse(products);
        if (!lang) return res.json( products );
        products = langReplace(products, lang);
        return  res.json( products );
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
        products = products.filter(product => {
            if(product.parentCategory.slug == categorySlug) return product;
            if(product.subCategory.slug == categorySlug) return product;
            if(product.childCategory.slug == categorySlug) return product;
            
        })

        products = JSON.stringify(products);
        products = JSON.parse(products);
        if (!lang) return res.json({ result: products });
        products = langReplace(products, lang);
        for (const product of products) {
            product.brend.discription = langReplace(product.brend.discription, lang);
            product.properteis = langReplace(product.properteis, lang);
            product.parentCategory = langReplace(product.parentCategory, lang);
            product.subCategory = langReplace(product.subCategory, lang);
            product.childCategory = langReplace(product.childCategory, lang);

        }
         return res.json( products );
    } catch (error) {
        console.log(error)
    }
});



// one product by id 
router.get("/product-slug/:slug", async (req, res) => {
    try {
        let lang = req.headers['lang'];
        let product = await productModel.findOne({slug: req.params.slug})
            .populate("parentCategory")
            .populate("subCategory")
            .populate("childCategory")
            .populate("shop");


        product = JSON.stringify(product);
        product = JSON.parse(product);
        if (!lang) return res.json({ result: product });

        product = langReplace(product, lang);
        product.properteis = product.properteis.map(item => langReplace(item, lang));
        product.parentCategory = langReplace(product.parentCategory, lang);
        product.subCategory = langReplace(product.subCategory, lang);
        product.childCategory = langReplace(product.childCategory, lang);

        return res.status(200).json( product )
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
        res.json({ result: deleted });
    } catch (error) {

    }
});


module.exports = router;



