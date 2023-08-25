const cartModel = require("../models/cart.model");
const router = require("express").Router();
const mogoose = require("mongoose")
router.post("/add-cart", async(req, res) => {
    try {
        let result = await cartModel.find();
        result = result.find(cart => cart.products.toString() == req.body.products.toString());
        if(result) {
            console.log(result)
          return await cartModel.updateOne({quantity:req.body.quantity});
        }
         
        result = await cartModel(req.body).save();
        
    
        res.json({result});
    } catch (error) {
        console.log(error)
    }
});

router.get("/cart", async(req, res) => {
    try {
        const result = await cartModel.find().populate("products")
        res.json(result);
    } catch (error) {
        console.log(error)
    }
})


router.get("/cart/:id", async(req, res) => {
    try {
        let result = await cartModel.find();
        result = result.find(cart => cart.products.toString() == req.params.id.toString());
        return res.json(result);
    } catch (error) {
        console.log(error)
    }
})


module.exports = router;