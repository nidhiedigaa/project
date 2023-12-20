require('dotenv').config()
const express=require('express')
const {user_collection}=require('../mongo/user')
const parser=require('body-parser')
const bcrypt=require('bcrypt')
const randomstring=require('randomstring')
const nodemailer=require('nodemailer')
const jwt=require('jsonwebtoken')
const upload=require('./multer')
const product_collection=require('../mongo/user')
const route=require('./productserver')
const path=require('path')



const app=express()
app.use(parser.urlencoded({extended:true}))
app.use(parser.json())
app.use(route)
app.use('/uploads',express.static('./uploads'))

app.get('/',(req,res)=>
{
    res.status(200).sendFile(path.resolve(__dirname,'form.html'))
})

app.post('/register',async(req,res)=>
{
    const{name,email,password}=req.body
    console.log(name,email,password)
    if(name && email && password)
    {
        try
        {
            const checkUser=await user_collection.findOne({email:email})
            console.log(checkUser)
            if(checkUser)
            {
                return res.status(200).send('user is already registered')
            }
            else
            {
                const verificationToken=randomstring.generate()
                
                const hashedPassword=await bcrypt.hash(password,10)
               
                const insertedValue=await user_collection.create({name:name,password:hashedPassword,email:email,token:verificationToken})
               
                const transporter=nodemailer.createTransport( {
                    host: 'smtp.gmail.com',
                      port: 587,
                      secure: false,
                      requireTLS: true,
                      auth: {
                          user: process.env.EMAIL,
                          pass: process.env.EMAIL_PASSWORD,
                      },
              })
              const verificationLink=`http://localhost:${process.env.PORT}/email-verify?token=${verificationToken}`
              const mailOptions={
                from:process.env.EMAIL,
                to:email,
                subject:'link for email confirmation',
                html:`<p>click <a href="${verificationLink}">here</a> for email confirmation</p>`
              }
              transporter.sendMail(mailOptions,(err,info)=>
              {
                if(err)
                {
                    return res.status(400).send('could not send the mail')
                }
                else
                {
                    return res.status(200).send('mail has been sent go and verify your email')
                }
              })
            }
        }
        catch(error)
        {
            return res.status(500).send('server error')
        }
    }
    else
    {
        return res.status(400).send('send all the details')
    }
})

app.get('/email-verify',async(req,res)=>
{
    const{token}=req.query
    console.log(token)
    try
    {
        const checkToken=await user_collection.findOne({token:token})
        console.log(checkToken)
        if(checkToken)
        {
            const updatedValue=await user_collection.updateOne({isVerified:true},{$set:{token:''}})
            return res.status(200).send('registered successfully')
           
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
})


app.post('/login',async(req,res)=>
{
    const{email,password}=req.body
    if(email,password)
    {
        try
        {
            const checkEmail=await user_collection.findOne({email:email})
            if(checkEmail)
            {
                const uniqueKey=jwt.sign({email:email},process.env.SECRET_KEY,{expiresIn:'50m'})
                return res.status(200).json(uniqueKey)
            }
            else
            {
                return res.status(400).send('incorrect email or user is not registered')
            }
        }
        catch(error)
        {
            return res.status(500).send('server error')
        }
    }
    else
    {
        return res.status(400).send('enter both email and password')
    }
})

app.post('/forgot-password',async(req,res)=>
{
    const {email}=req.body
    if(email)
    {
        try
        {
            const checkEmail=await user_collection.findOne({email:email})
            if(checkEmail)
            {
                const verificationToken=randomstring.generate()
                const updatedValue=await user_collection.updateOne({email:email},{$set:{token:verificationToken}})
                const transporter=nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                      port: 587,
                      secure: false,
                      requireTLS: true,
                      auth: {
                          user: process.env.EMAIL,
                          pass: process.env.EMAIL_PASSWORD,
                      },
              })
              const verificationLink=`http://localhost:${process.env.PORT}/reset-password?token=${verificationToken}`
              const mailOptions={
                from:process.env.EMAIL,
                to:email,
                subject:'link to reset the password',
                html:`<p>click <a href="${verificationLink}">here</a> to reset the password</p>`
              }
              transporter.sendMail(mailOptions,(err,info)=>
              {
                if(err)
                {
                    return res.status(400).send('could not send the mail')
                }
                else
                {
                    return res.status(200).send('go and check the mail to reset the password')
                }
              })
            }
            else
            {
                return res.status(400).send('email was not found')
            }
        }
        catch(error)
        {
            return res.status(500).send('server error')
        }
    }
    else
    {
        return res.status(400).send('provide registered email')
    }
})

app.get('/reset-password',async(req,res)=>
{
    const {token}=req.query
    if(token)
    {
        try
        {
            const checkToken=await user_collection.findOne({token:token})
            if(checkToken)
            {
                return res.status(200).send(`<form action='/reset-password' method='post'>
                <label for="password">ENTER NEW PASSWORD</label><br>
                <input type="password" name="password" id="password">
                <input type="hidden" name="token" value=${token}>
                <input type="submit">
                </form>`)
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
        return res.status('token was not found')
    }
})

app.post('/reset-password',async(req,res)=>
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
                const updatedValue=await user_collection.updateOne({token:token},{$set:{password:hashedPassword,token:''}})
                return res.status(200).send('password reset is successful')
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
        return res.status(400).send('did not recieve token/password')
    }
})

app.listen(process.env.PORT,()=>console.log(`server is running on ${process.env.PORT}`))