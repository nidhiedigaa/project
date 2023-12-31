const express=require('express')
const category_collection=require('../model/category')


const category_route=express.Router()

category_route.get('/category',async(req,res)=>
{   
        try
        {
            console.log('connecetd to category path')
            console.log(category_collection)
            const category=await category_collection.find()
            console.log(category)
            if(category.length!=0)
            {
                return res.status(200).json(category)
            }
            else
            {
                return res.status(400).send('no category')
            }
        }
        catch(error)
        {
            return res.status(500).send('server error')
        }
})


module.exports=category_route