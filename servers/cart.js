const express=require('express')
const {cart_item_collection,cart_collection}=require('../model/cart')
const product_collection=require('../model/product')
const buyer_collection=require('../model/buyer')
const cart_item_route=express.Router()
const cart_route=express.Router()

cart_item_route.post('/add-item',async(req,res)=>
{
    try
    {
        const {product_id,quantity,buyer_id}=req.body
        console.log(product_id,quantity)
        const checkProduct=await product_collection.findOne({_id:product_id})
        console.log(checkProduct)
        if(checkProduct)
        {
            const checkCart=await cart_item_collection.findOne({item:product_id})
            console.log(checkCart)
            console.log(quantity<=checkProduct.quantity)
            if(checkCart)
            {
                if(quantity<=(checkProduct.quantity-checkCart.quantity))
                {

                    const updateCart=await cart_item_collection.findOneAndUpdate({item:product_id},{$inc:{quantity:quantity},$set:{total:(checkCart.total)+(quantity*checkProduct.price)}},{new:true})

                    return res.status(200).json({message:'item added to cart',cart_id:checkCart._id,price:updateCart.total})
                }
                else
                {
                    return res.status(400).send('item sold out')
                }
            }
            else if(quantity<=checkProduct.quantity)
            {
                console.log('hey')
                const addCart=await cart_item_collection.create({item:product_id,quantity:quantity,total:(quantity*checkProduct.price)})
                console.log(addCart)
                const checkCart=await cart_item_collection.findOne({item:product_id})
                console.log(checkCart)
                return res.status(200).json({message:'item added to cart',cart_id:addCart._id,price:addCart.total})
            }
            else
            {
                return res.status(400).send('item sold out')
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
    console.log(req.body)
    try
    {
        let item=[]
        for(let i =0;i<items.length;i++)
        {
            console.log(items[i])
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
       console.log('bill',bill)
        const addCart=await cart_collection.create({items:items,total:bill,buyer:item[0].buyer_id})
        console.log(addCart)
      console.log('main cart')
        return res.status(200).json({total:addCart.total,cart_id:addCart._id})
    }
    catch(error)
    {
        console.log(error)
        return res.status(500).send('server error')
    }
})

module.exports={cart_item_route,cart_route}