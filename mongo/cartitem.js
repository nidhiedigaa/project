const {mongoose}=require('./user')

const cart_item_schema=new mongoose.Schema({
    item:{type:mongoose.Schema.Types.ObjectId,ref:"products"},
    quantity:{type:Number,required:true},
    price:{type:Number,required:true}
})

const cart_item_collection=new mongoose.model('cartitems',cart_item_schema)


module.exports=cart_item_collection