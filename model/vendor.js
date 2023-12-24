
const mongoose=require('./connection')



const vendor_schema=new mongoose.Schema({
    details:{type:mongoose.Schema.Types.ObjectId,ref:'user'},
    products:[{type:mongoose.Schema.Types.ObjectId,ref:'product'}]
})


const vendor_collection=new mongoose.model('vendor',vendor_schema)


module.exports=vendor_collection