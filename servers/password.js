const express=require('express')
const user_collection=require('../model/user')
const nodemailer=require('nodemailer')
const bcrypt=require('bcrypt')


const password_route=express.Router()


password_route.post('/forgot-password',async (req,res)=>
{
    const{email}=req.body
    if(email)
    {
        console.log(email)
        const checkEmail=await user_collection.findOne({email:email})
        if(checkEmail)
        {
            const token=process.env.VERIFICATION_TOKEN
            const updateUser=await user_collection.updateOne({email:email},{$set:{token:token}})
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
            const resetLink=`http://localhost:5454/reset-password?token=${token}`
            const mailOptions={from:process.env.EMAIL,to:email,subject:'LINK TO RESET THE PASSWORD',html:`<p>click <a href="${resetLink}">here</a> ro reset the password</p>`}
            transporter.sendMail(mailOptions,(err,info)=>
            {
                if(err)
                {
                    return res.status(400).send('could not send the mail')
                }
                else
                {
                    return res.status(200).send('mail is sent go and check')
                }
            })
        }
        else
        {
            return res.status(400).send('user not found by this email')
        }
    }
    else
    {
        return res.status(400).send('give correct email')
    }
})


password_route.get('/reset-password',async(req,res)=>
{
    const {token}=req.query
    console.log(token)
    if(token)
    {
        console.log(token)
        try
        {
            const checkToken=await user_collection.findOne({token:token})
            if(checkToken)
            {
                return res.status(200).send(`<form action="http://localhost:5454/reset-password" method="post"><input type="hidden" name="token" value=${token}><label>ENTER NEW PASSWORD</label> <input type="password" name="password"> <input type="submit"></form>`)
            }
            else
            {
                return res.status(400).send('token did not match')
            }
        }
        catch(error)
        {
            return res.status(500).send('server error')
        }
    }
    else
    {
        return res.status(400).send('token was not recieved')
    }
})

password_route.post('/reset-password',async(req,res)=>
{
    const{password,token}=req.body
    if(password && token)
    {
        try
        {
            const checkToken=await user_collection.findOne({token:token})
            if(checkToken)
            {
                const hashedPassword=await bcrypt.hash(password,10)
                const updateValue=await user_collection.updateOne({token:token},{$set:{password:hashedPassword,token:''}})
                return res.status(200).send('password reset succesful')
            }
            else
            {
                return res.status(400).send('token did not match')
            }
            }
        catch(error)
        {
            return res.status(500).send('server error')
        }
    }
    else
    {
        return res.status(400).send('token is not found')
    }
})

module.exports=password_route