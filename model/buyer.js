const mongoose=require('./connection')



const buyer_schema=new mongoose.Schema({
    details:{type:mongoose.Schema.Types.ObjectId,ref:'user'},
    orders:[{type:mongoose.Schema.Types.ObjectId,ref:'order'}],
    cart:{type:mongoose.Schema.Types.ObjectId,ref:'cart'},
    address:[{street:String,city:String,pincode:String,state:String}],
    paymentModes: [
        {
          cardNumber: String,
          cardHolderName: String,
          expirationDate: String,
        },
      ]
})



const buyer_collection=new mongoose.model('buyer',buyer_schema)



module.exports=buyer_collection