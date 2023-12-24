const express=require('express')
const user_collection=require('../model/user')



const email_verification_route=express.Router()


email_verification_route.get('/verify-email',async(req,res)=>
{
    const{token}=req.query
    if(token)
    {
        const checkToken=await user_collection.findOne({token:token})
        if(checkToken)
        {
            const updateUser=await user_collection.updateOne({token:token},{$set:{token:'',isVerified:true}})
            return res.status(200).send('email is verified')
        }
        else
        {
            return res.status(200).send('token did not match')
        }
    }
    
    else
    {
        return res.status(200).send('token was not recieved')
    }
})


module.exports=email_verification_route