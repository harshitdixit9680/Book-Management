const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Card = require("../models/Card");
const stripe = require("stripe")("sk_test_51OxhPwSHqp6XtKOEBoZjDDDDFoyijklYa3kQloW8GBi5iKBubD5k3r1SYC5F13iP9Fe8Y7olkuJIQ8TNHbOLLH6t00GzMvZMBX");


router.post("/create-checkout-session", async (req, res) => {
  
    const {products} = req.body;
        
        // const card = req.body;
        const lineItems = products.map((product)=>({
            price_data:{
                currency:"inr",
                product_data:{
                    name:product.title,
                    // images:[product.imgdata]
                },
                unit_amount:product.price * 100,
            },
            quantity: product.qnty || 1, 
        }));
    
        const session = await stripe.checkout.sessions.create({
            payment_method_types:["card"],
            line_items:lineItems,
            mode:"payment",
            success_url:"http://localhost:3001/sucess",
            cancel_url:"http://localhost:3001/cancel",
            billing_address_collection: "auto", 
            shipping_address_collection: {
                allowed_countries: ["US", "CA", "GB", ], // Add other allowed countries outside India
            },
        });
    
        res.json({id:session.id})
       

        
   
});

module.exports = router;
