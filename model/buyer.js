const mongoose=require('./connection')



const buyer_schema=new mongoose.Schema({
    details:{type:mongoose.Schema.Types.ObjectId,ref:'user'},
    address:[{type:mongoose.Schema.Types.ObjectId,ref:'address'}],
    orders:[{type:mongoose.Schema.Types.ObjectId,ref:'order'}]
})



const buyer_collection=new mongoose.model('buyer',buyer_schema)



module.exports=buyer_collection