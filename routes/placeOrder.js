const express = require("express");
const Order = require("../models/Order")
const router = express.Router();


router.post("/", async (req, res, next) => {
    // console.log();
    var orderItems = [];

    cartProducts = req.body.orderDetails.cart_products;
    cartProducts.forEach(myFunction);
    function myFunction(item, index, cartProducts) {
        console.log(item);
        var obj = {
            id: item._id,
            quantity: item.pQuantity,
        }
        orderItems.push(obj);
      }
    const order = new Order({
        // seller: req.body.orderItems[0].seller,
        transactionId: req.body.orderDetails.order_number,
        orderDateAndTime: req.body.orderDetails.order_date,
        orderItems: orderItems,
        shippingAddress: req.body.orderDetails.shipping_address,
        paymentMethod: req.body.orderDetails.payment_method,
        // paymentMethod: req.body.paymentMethod,
        itemsPrice: req.body.orderDetails.order_total,
        // shippingPrice: req.body.shippingPrice,
        // taxPrice: req.body.taxPrice,
        totalPrice: req.body.orderDetails.order_total,
        user:  req.userData.userId,
      });
      const createdOrder = await order.save();
      res
        .status(201)
        .send({ message: 'New Order Created', order: createdOrder });
    }
);

module.exports = router;
