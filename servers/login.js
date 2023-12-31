const express=require('express')
const user_collection=require('../model/user')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')


const login_route=express.Router()


login_route.post('/login',async(req,res)=>
{
    const{email,password}=req.body
    if(email && password)
    {
        try
        {
            const checkEmail=await user_collection.findOne({email:email})
            if(checkEmail)
            {
                const checkVerification=await user_collection.findOne({isVerified:true,email:email})
                if(checkVerification)
                {
                    const checkPassword=await bcrypt.compare(password,checkVerification.password)
                    if(checkPassword)
                    {
                        const secretToken=jwt.sign({email:email},process.env.SECRET_KEY,{expiresIn:'10m'})
                        return res.status(200).send({message:'login successful',token:secretToken})
                    }
                    else
                    {
                        return res.status(400).send({message:'wrong password'})
                    }
                }
                else
                {
                    return res.status(400).send({message:'email is not yet verified since regisration, go and check your mail and please register'})
                }
            }
            else
            {
                return res.status(400).send({message:'incorrect email'})
            }
        }
        catch(error)
        {
            return res.status(400).send({message:'server error'})
        }
    }
    else
    {
        return res.status(400).send({message:'enter correct email or password'})
    }
})

module.exports=login_route