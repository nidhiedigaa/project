const express=require('express')
const address_collection=require('../model/address')
const user_collection=require('../model/user')


const address_route=express.Router()

address_route.post('/address',async(req,res)=>
{
    const {user_id,street,pincode,city}=req.body
    if(user_id && street && pincode && city)
    {
        try
        {
            const addAddress=await address_collection.create({user:user_id,street:street,city:city,pincode:pincode})
            const addUser=await user_collection.updateOne({_id:user_id},{$push:{address:addAddress._id}})
            return res.status(200).send('address added')
        }
        catch(error)
        {
            return res.status(500).send('server error')
        }
    }
    else
    {
        return res.status(400).send('provide all the required details')
    }
})


module.exports=address_route