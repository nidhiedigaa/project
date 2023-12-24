const express=require('express')
const address_collection=require('../model/address')
const order_collection=require('../model/order')
const {cart_collection,cart_item_collection}=require('../model/cart')
const product_collection=require('../model/product')
const buyer_collection=require('../model/buyer')


const order_route=express.Router()


order_route.post('/order',async(req,res)=>
{
    const{cart_id,address_id,user_id,buyer_id}=req.body
    if(cart_id && address_id && buyer_id && user_id)
    {
        try
        {
            const getCart=await cart_collection.findOne({_id:cart_id})
            const findProduct=getCart.items
            let items=[]
            for(let i=0;i<findProduct.length;i++)
            {
                const getItem=await cart_item_collection.findOne({_id:findProduct[i]})
                items.push(getItem)
            }
            for(let i=0;i<items.length;i++)
            {
                const checkProduct=await product_collection.findOne({_id:items[i].item})
                const getProduct=await product_collection.updateOne({_id:items[i].item},{$set:{quantity:checkProduct.quantity-items[i].quantity}})
            }
            const placeOrder=await order_collection.create({buyer:buyer_id,address:address_id,bill:getCart.total})
            const checkCart=await cart_collection.findOne({_id:cart_id},{items:1})
            for(let i =0;i<=checkCart.length;i++)
            {
                const removeItems=await cart_item_collection.deleteOne({_id:checkCart[i]})
            }
            const updateCart=await cart_collection.deleteOne({_id:cart_id})

            const buyerUpdate=await buyer_collection.updateOne({_id:user_id},{$push:{address:address_id,order:placeOrder._id}})
            return res.status(200).send('order is placed')
        }
        catch(error)
        {
            console.log(error)
            return res.status(500).send('server error')
        }
    }
    else
    {
        return res.status(400).send('provide proper ids')
    }
})


module.exports=order_route