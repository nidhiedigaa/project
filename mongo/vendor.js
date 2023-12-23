const {mongoose}=require('./user')



const vendors_schema=new mongoose.Schema({
    details:{type:mongoose.Schema.Types.ObjectId,ref:'users'},
    products:[{type:mongoose.Schema.Types.ObjectId,ref:'products'}]
})


const vendors_collection=new mongoose.model('vendors',vendors_schema)



module.exports=vendors_collection