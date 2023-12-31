const express=require('express')
const user_collection=require('../model/user')
const help_collection=require('../model/help')




const help_route=express.Router()


help_route.post('/help',async(req,res)=>
{
    console.log(req.body)
    const{name,email,subject,message}=req.body
    if(name && email)
    {
        checkEmail=await user_collection.findOne({email:email})
        if(checkEmail)
        {
            const insertFeedback=await help_collection.create({name:name,email:email,subject:subject,message:message})
            const updateUser=await user_collection.updateOne({email:email},{$push:{feedback:insertFeedback._id}})
            return res.status(200).send('Your message has been recieved,we will look into it')
        }
        else
        {
            return res.status(400).send('user not found by the email you have given')
        }
    }
    else
    {
        return res.status(400).send('fill out the details properly')
    }
})


module.exports=help_route