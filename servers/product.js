const express=require('express')
const product_collection=require('../model/product')
const vendor_collection=require('../model/vendor')
const upload=require('./multer')

const product_route=express.Router()


product_route.post('/add-products',upload.single('file'),async(req,res)=>
{
    const{name,price,quantity,color,brand,main_category,sub_category,vendor_id}=req.body
    const image=req.file
    console.log(image)
    if(name && price && quantity && color&& brand && main_category && sub_category && vendor_id)
    {
        try
        {
           const checkVendor=await vendor_collection.findOne({_id:vendor_id})
           if(checkVendor)
           {
            const uploadProducts=await product_collection.create({name:name,price:price,quantity:quantity,color:color,brand:brand,main_category:main_category,sub_category:sub_category,vendor:vendor_id})
            const updateVendor=await vendor_collection.updateOne({_id:vendor_id},{$push:{products:uploadProducts._id}})
            return res.status(200).send('products added successfully')
           }
           else
           {
            return res.status(400).send('only vendors can add products')
           }

        }
        catch(error)
        {
            return res.status(500).send('server error')
        }
    }
    else
    {
        return res.status(400).send('provide the proper details')
    }
})

product_route.get('/products',async(req,res)=>
{
    try
    {
        const products=await product_collection.find()
        if(products.length!=0)
        {
            return res.status(200).json(products)
        }
        else
        {
            return res.status(400).send('empty products')
        }
    }
    catch(error)
    {
        return res.status(500).send('server error')
    }
})


module.exports=product_route

