const express=require('express')
const user_collection=require('../model/user')
const vendor_collection=require('../model/vendor')
const buyer_collection=require('../model/buyer')
const bcrypt=require('bcrypt')
const nodemailer=require('nodemailer')


const register_route=express.Router()

function sendMail(email,res)
{
    const validationLink=`http://localhost:5454/verify-email?token=${process.env.VERIFICATION_TOKEN}`
    const transporter=nodemailer.createTransport({
        host:'smtp.gmail.com',
        port:587,
        secure:false,
        requireTLS:true,
        auth:
        {
            user:process.env.EMAIL,
            pass:process.env.PASSWORD
        }

    })
    const mailOptions={from:process.env.EMAIL,to:email,subject:'LINK FOR EMAIL VERIFICATION FOR REGISTRATION',html:`<p>clicl <a href="${validationLink}">here</a> for email verification for registration</p>`}
    transporter.sendMail(mailOptions,(err,info)=>
    {
        if(err)
        {
            return res.status(400).send('could not send the mail')
        }
        else
        {
            return res.status(200).send('mail has been sent for email verification')
        }
    })
}

register_route.post('/register',async(req,res)=>
{
    console.log('hello')
    const {name,email,password,role}=req.body
    if(name && email && password && role)
    {
        const checkEmail=await user_collection.findOne({email:email})
        if(!checkEmail)
        {
            const hashedPassword=await  bcrypt.hash(password,10)
            try
            {
                if(role==='buyer')
                {
                    console.log('buyer')
                    const token=process.env.VERIFICATION_TOKEN
                  console.log(token)
                    const userInsert=await user_collection.create({name:name,email:email,password:hashedPassword,role:role,token:token})
                    console.log(userInsert)
                    const buyerInsert=await buyer_collection.create({details:userInsert._id})
                    console.log(buyerInsert)
                    const userBuyer=await user_collection.updateOne({_id:userInsert._id},{$set:{buyer:buyerInsert._id}})
                    console.log(userBuyer)
                    sendMail(email,res)
    
                }
                else if(role === 'vendor')
                {
                    const token=process.env.VERIFICATION_TOKEN
                    const userInsert=await user_collection.create({name:name,email:email,password:hashedPassword,role:role,token:token})
                    const vendorInsert=await vendor_collection.create({details:userInsert._id})
                    const userVendor=await user_collection.updateOne({_id:userInsert._id},{$set:{vendor:vendorInsert._id}})
                    sendMail(email,res)
                    
                }
                else
                {
                    return res.status(400).send('choose the proper role')
                }
            }
            catch(error)
            {
                return res.status(500).send('server error')
            }
        
        }
        else
        {
            return res.status(200).send(' this email has already been registered')
        }
    }
    else
    {
        return res.status(400).send('fill out all the details')
    }
})


module.exports=register_route