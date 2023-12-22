const express=require('express')
const {order_collection}=require('../mongo/user')
const {product_collection}=require('../mongo/user')
const {user_collection} =require('../mongo/user')
const {address_collection}=require('../mongo/user')

const order_route=express.Router()



order_route.post('/place-order',async(req,res)=>
{
    const{products,user_id,quantity,address_id}=req.body
    const totalPrice=0
    try
    {   
       for(i of products)
       {
        const product=await product_collection.findOne({_id:i})
        totalPrice=product.price*quantity

       }
        const user=await user_collection.findOne({_id:user_id})
        const address=await address_collection.findOne({_id:address_id})
        if(user && address)
        {
            const insertedValue=await order_collection.create({user:user_id,products:[{product:product_id,quantity}],totalPrice:totalPrice,shippingAddress:address_id})
            return res.status(200).send('order placed successfully')
        }
        else
        {
            return res.status(400).send('user not found')
        }
    }
    catch(error)
    {
        return res.status(500).send('server error')
    }
})


module.exports=order_route