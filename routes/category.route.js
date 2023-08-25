const router = require("express").Router();
const slugify = require("slugify");
const fs = require("fs");
const categoryModel = require("../models/category.model");

// Create new Category 
router.post("/category", async (req, res) => {
    try {
        req.body.slug = {
            uz: slugify(req.body.name.uz),
            ru: slugify(req.body.name.ru)
        };

        const category = await categoryModel(req.body).save();
        res.json({ result: category })
    } catch (error) {
        console.log(error)
    }
});



// Get all category
router.get("/category", async (req, res) => {
    try {
        const lang = req.headers["lang"];
        let categories = await categoryModel.find();
        let categoryList = nestedCategories(categories);
        categoryList = Array.from(categoryList);
        if(!lang) return res.json({ result: categoryList });
        for (const category of categoryList) {
            category.name = category.name[lang];
            category.slug = category.slug[lang];
            for(const subCategory of category.children) {
                subCategory.name = subCategory.name[lang];
                subCategory.slug = subCategory.slug[lang];
                for(const childCategory of subCategory.children) {
                    childCategory.name = childCategory.name[lang];
                    childCategory.slug = childCategory.slug[lang];
                }
            }
        }
        return res.json({ result: categoryList });
    } catch (err) {
        console.log(err);
    }
});

function nestedCategories(categories, parentId = null) {
    const categoryList = [];
    let category;
    if (parentId == null) {
        category = categories.filter(cat => cat.parentId == null);
    } else {
        category = categories.filter(cat => cat.parentId == parentId);
    }

    for (let cate of category) {
        categoryList.push({
            _id: cate._id,
            name: cate.name,
            slug: cate.slug,
            image: cate.image,
            icon: cate.icon,
            parentId: cate.parentId,
            createdBy: cate.createdBy,
            createdAt: cate.createdAt,
            updatedAt: cate.updatedAt,
            children: nestedCategories(categories, cate._id)
        })
    }
    return categoryList;
}


// Get byId Category 
router.get("/category/:id", async (req, res) => {
    try {
        const lang = req.headers["lang"];
        let category = await categoryModel.findById(req.params.id);
        if(!lang) return res.json({ result: category });
        category = JSON.stringify(category);
        category = JSON.parse(category);
        category.name = category.name[lang];
        category.slug = category.slug[lang];
        res.json({ result: category });
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
        console.log(deleted)
        res.json({ result: deleted });
    } catch (error) {

    }
})





module.exports = router;