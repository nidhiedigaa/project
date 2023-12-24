const mongoose=require('./connection')



const order_schema=new mongoose.Schema({
    buyer:{type:mongoose.Schema.Types.ObjectId,ref:'buyer'},
    bill:{type:Number,required:true},
    address:{type:mongoose.Schema.Types.ObjectId,ref:'address'},
    
})


const order_collection=new mongoose.model('order',order_schema)


module.exports=order_collection
