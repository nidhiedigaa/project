const mongoose=require('./connection')


const address_schema=new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:'user'},
    street:{type:String,required:true},
    city:{type:String,required:true},
    pincode:{type:Number,required:true}
})


const address_collection=new mongoose.model('address',address_schema)


module.exports=address_collection
