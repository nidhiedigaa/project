require('dotenv').config()
const express=require('express')
const register_route=require('./register')
const cors=require('cors')
const parser=require('body-parser')
const email_verification_route=require('./email-verification')
const login_route=require('./login')
const password_route=require('./password')
const product_route=require('./product')
const {cart_item_route} =require('./cart')
const {cart_route}=require('./cart')
const address_route=require('./address')
const order_route=require('./order')
const app=express()




const corsOptions={origin:'http://127.0.0.1:5500'}
app.use(parser.urlencoded({extended:true}))
app.use(parser.json())
app.use(cors(corsOptions))
app.use(register_route)
app.use(email_verification_route)
app.use(login_route)
app.use(password_route)
app.use(product_route)
app.use(cart_item_route)
app.use(cart_route)
app.use(address_route)
app.use(order_route)

app.listen(process.env.PORT,()=>console.log(`server is running on ${process.env.PORT}`))