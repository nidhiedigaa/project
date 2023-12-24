const express=require('express')
const {cart_item_collection,cart_collection}=require('../model/cart')
const product_collection=require('../model/product')

const cart_item_route=express.Router()
const cart_route=express.Router()

cart_item_route.post('/add-item',async(req,res)=>
{
    try
    {
        const {product_id,quantity}=req.body
        const checkProduct=await product_collection.findOne({_id:product_id})
        console.log(checkProduct)
        if(checkProduct)
        {
            const checkCart=await cart_item_collection.findOne({item:product_id})
            console.log(checkCart)
            if(checkCart)
            {
                if(quantity<=(checkProduct.quantity-checkCart.quantity))
                {
                    const updateCart=await cart_item_collection.updateOne({item:product_id},{$inc:{quantity:quantity},$set:{total:(checkCart.total)+(quantity*checkProduct.price)}})
                    return res.status(200).send('item added to cart')
                }
                else
                {
                    return res.status(200).send('item sold out')
                }
            }
            else if(quantity<=checkProduct.quantity)
            {
                const addCart=await cart_item_collection.create({item:product_id,quantity:quantity,total:(quantity*checkProduct.price)})
                console.log(addCart)
                const checkCart=await cart_item_collection.findOne({item:product_id})
                console.log(checkCart)
                return res.status(200).send('item added to cart')
            }
            else
            {
                return res.status(200).send('item sold out')
            }
        }
        else
        {
            return res.status(400).send('could not find the product')
        }
    }
    catch(error)
    {
        return res.status(500).send('server error')
    }
})

cart_route.post('/cart',async(req,res)=>
{
    const{items}=req.body
    try
    {
        let item=[]
        for(let i =0;i<items.length;i++)
        {
            let data=await cart_item_collection.findOne({_id:items[i]})
            if(data)
            {
                item.push(data)
            }
            else
            {
                return res.status(200).send('item not found')
            }
        }
       let bill=item.reduce((total,ele,ind)=>
       {
            return total+=ele.total
       },0)
        const addCart=await cart_collection.create({items:items,total:bill})
        console.log(addCart)
        return res.status(200).send('added to cart')
    }
    catch(error)
    {
        console.log(error)
        return res.status(500).send('server error')
    }
})

module.exports={cart_item_route,cart_route}