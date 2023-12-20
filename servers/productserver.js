require('dotenv').config()
const express=require('express')
const {product_collection}=require('../mongo/user')
const parser=require('body-parser')
const upload=require('./multer')



const app=express()
app.use(parser.urlencoded({extended:true}))
app.use(parser.json())

const route=express.Router()





route.post('/add-products',upload.single('file'),async(req,res)=>
{
    const{name,description,price,quantity,category}=req.body
    console.log(req.file)
     const uploadedFileName = req.file.filename;

    // Construct the URL
    const imageUrl = `http://localhost:${process.env.PORT}/uploads/${uploadedFileName}`;
  if(name && description && price && quantity && category)
  {
    try
    {
        const insertValue=await product_collection.create({name:name,description:description,price:price,quantity:quantity,category:category,image:imageUrl})
        return res.status(200).send('product details uploaded succesfully')
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

module.exports=route

