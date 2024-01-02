const express=require('express')
const address_collection=require('../model/address')
const order_collection=require('../model/order')
const {cart_collection,cart_item_collection}=require('../model/cart')
const product_collection=require('../model/product')
const buyer_collection=require('../model/buyer')


const order_route=express.Router()


order_route.post('/order',async(req,res)=>
{
    const{cart_id,user_id,buyer_id,address}=req.body
    console.log(req.body)
    if(cart_id && buyer_id && user_id)
    {
        try
        {
            const getCart=await cart_collection.findOne({_id:cart_id})
            console.log(getCart+" cart items")
            if(!getCart)
            {
                return res.status(400).send('cart is empty')
            }
            const findProduct=getCart.items
            console.log(getCart.items)
            let cartitems=[]
            for(let i=0;i<findProduct.length;i++)
            {
                const getItem=await cart_item_collection.findOne({_id:findProduct[i]})
                cartitems.push(getItem)
            }
            console.log(cartitems)
            for(let i=0;i<cartitems.length;i++)
            {
                const checkProduct=await product_collection.findOne({_id:cartitems[i].item})
                const getProduct=await product_collection.updateOne({_id:cartitems[i].item},{$set:{quantity:checkProduct.quantity-cartitems[i].quantity}})
            }
            const placeOrder=await order_collection.create({buyer:buyer_id,bill:getCart.total})
            console.log(placeOrder)
            const checkCart=await cart_collection.findOne({_id:cart_id},{items:1})
            console.log(checkCart+' only items')
            for(let i =0;i<checkCart.items.length;i++)
            {
                console.log('removing')
                const removeItems=await cart_item_collection.deleteOne({_id:checkCart.items[i]})
                console.log(removeItems)
            }
            const updateCart=await cart_collection.deleteOne({_id:cart_id})
            console.log(updateCart)
            const buyerUpdate=await buyer_collection.updateOne({_id:user_id},{$push:{orders:placeOrder._id,address:address}})
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