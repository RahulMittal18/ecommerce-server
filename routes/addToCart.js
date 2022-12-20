const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Cart = require('../models/Cart');
const ProductDetailSchema = require('../models/Product');



router.post('/', async(req, res, next) => {
    // console.log(req);
    const {
        productId
    } = req.body;
    const quantity = Number.parseInt(req.body.quantity);

    try {
        // -------Get users Cart ------
        let cart = await Cart.findOne({
            userId: req.userData.userId
        })

        //-----Get Selected Product Details ----
        const productDetails = await ProductDetailSchema.findById(productId);
        console.log(productDetails);
        //-- Check if cart Exists and Check the quantity if items -------
        if (!cart && quantity && item.productId == productId){

            //------this removes an item from the the cart if the quantity is set to zero,We can use this method to remove an item from the list  --------
            // if (indexFound !== -1 && quantity &&  item.total).reduce((acc, next) => acc + next);
            // }

            //----------check if product exist,just add the previous quantity with the new quantity and update the total price-------
            if (indexFound !== -1) {
                cart.items[indexFound].quantity = cart.items[indexFound].quantity + quantity;
                cart.items[indexFound].total = cart.items[indexFound].quantity * productDetails.pricing[0].price;
                cart.items[indexFound].price = productDetails.pricing[0].price
                cart.subTotal = cart.items.map(item => item.total).reduce((acc, next) => acc + next);
            }

            //----Check if Quantity is Greater than 0 then add item to items Array ----
            else if (quantity > 0) {
                cart.items.push({
                    productId: productId,
                    quantity: quantity,
                    price: productDetails.pricing[0].price,
                    total: parseInt(productDetails.pricing[0].price * quantity)
                })
                cart.subTotal = cart.items.map(item => item.total).reduce((acc, next) => acc + next);
            }
            //----if quantity of price is 0 throw the error -------
            else {
                return res.status(400).json({
                    type: "Invalid",
                    msg: "Invalid request"
                })
            }
            let data = await cart.save();
            res.status(200).json({
                type: "success",
                mgs: "Process Successful",
                data: data
            })
        }
        //------------ if there is no user with a cart...it creates a new cart and then adds the item to the cart that has been created------------
        else {
            const cartData = {
                userId: req.userData.userId,
                items: [{
                    productId: productId,
                    quantity: quantity,
                    total: parseInt(productDetails.pricing[0].price * quantity),
                    price: productDetails.pricing[0].price
                }],
                subTotal: parseInt(productDetails.pricing[0].price * quantity)
            }
            cart = new Cart(cartData);
            let data = await cart.save();
            res.json(data);
        }
    } catch (err) {
        console.log(err)
        res.status(400).json({
            type: "Invalid",
            msg: "Something Went Wrong",
            err: err
        })
    }
}
)

module.exports = router;