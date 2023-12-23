const express=require('express')
const cart_item_collection=require('../mongo/cartitem')
const {product_collection} =require('../mongo/user')
const cart_collection=require('../mongo/cart')
const {mongoose}=require('../mongo/user')


const cart_item_route=express.Router()

cart_item_route.post('/add-item',async(req,res)=>
{
    const{product_id,quantity}=req.body
    if(product_id && quantity)
    {
        try
        {
            const checkProduct=await product_collection.findOne({_id:product_id})
           
            if(checkProduct)
            {   
                if(quantity<checkProduct.quantity)
                {
                    const checkItem=await cart_item_collection.findOne({item:product_id})
                    
                    if(checkItem && checkItem.quantity<checkProduct.quantity)
                    {
                        const updatedValue=await cart_item_collection.updateOne({item:product_id},{$set:{quantity:quantity+checkItem.quantity,price:checkItem.price+(quantity*checkProduct.price)}})
                        
                        
                        // const check=await cart_collection.find()
                        const check=await cart_collection.find({items:{$in:[checkItem._id]}})
                        console.log(check)
                       
                        console.log(check)
                      
                        return res.status(200).send('item added to cart successfully')

                    }
                    else if(!checkItem)
                    {
                        const updatedValue=await cart_item_collection.create({item:product_id,quantity:quantity,price:checkProduct.price*quantity})
                        const cart=await cart_collection.create({total:0})
                        const updateCart=await cart_collection.updateOne({_id:cart._id},{$push:{items:updatedValue._id},$inc:{total:updatedValue.price}})
                        
                        return res.status(200).send('item added to cart succesfully')
                    }
                    else
                    {
                        return res.status(200).send('item sold out')
                    }
                   
                }
                else
                {
                    return res.status(200).send('item sold out')
                }
            }
            else
            {
                return res.status(400).send('product is not present')
            }
        }
        catch(error)
        {
            console.log(error)
            return res.status(500).send('server error')
           
        }
    }
    else
    {
        return res.status(400).send('provide product ID and quantity')
    }
})


module.exports=cart_item_route