const {mongoose}=require('./user')


const cart_schema=new mongoose.Schema({
    items:[{type:mongoose.Schema.Types.ObjectId,ref:'cartitems'}],
    total:{type:Number,required:true}
})


const cart_collection=new mongoose.model('cart',cart_schema)



module.exports=cart_collection

