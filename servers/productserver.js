require('dotenv').config()
const express=require('express')
const {product_collection}=require('../mongo/user')
const parser=require('body-parser')
const upload=require('./multer')
const vendors_collection=require('../mongo/vendor')

// const app=express()
// app.use(parser.urlencoded({extended:true}))
// app.use(parser.json())

const product_route=express.Router()





product_route.post('/add-products',upload.single('file'),async(req,res)=>
{
    const{name,description,price,quantity,category,vendor_id}=req.body
    const imageUrl=''
    if(req.file)
    {
      const uploadedFileName = req.file.filename
      imageUrl = `http://localhost:${process.env.PORT}/uploads/${uploadedFileName}`;
    }
    

    // Construct the URL
   
  if(name && description && price && quantity && category)
  {
    try
    {
        const checkVendor=await vendors_collection.findOne({_id:vendor_id})
        if(checkVendor)
        {
          const insertValue=await product_collection.create({name:name,description:description,price:price,quantity:quantity,category:category,image:imageUrl,vendor:vendor_id})
          const updatedValue=await vendors_collection.updateOne({_id:vendor_id},{$push:{products:insertValue._id}})
        return res.status(200).send('product details uploaded succesfully')
        }
        else
        {
          return res.status(400).send('you cannot add the products')
        }
    }
    catch(error)
    {
        return res.status(500).send('server error')
    }
  }
  else
  {
    return res.status(400).send('provide all the required details of the product')
  }
})

module.exports=product_route

