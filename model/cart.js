const mongoose=require('./connection')



const cart_item_schema=new mongoose.Schema({
    item:{type:mongoose.Schema.Types.ObjectId,ref:'product'},
    quantity:{type:Number,required:true},
    total:{type:Number,required:true}
})


const cart_schema=new mongoose.Schema({
    items:[{type:mongoose.Schema.Types.ObjectId,ref:'cartitem'}],
    total:{type:Number,required:true}
})

const cart_item_collection=new mongoose.model('cartitem',cart_item_schema)
const cart_collection=new mongoose.model('cart',cart_schema)


module.exports={cart_item_collection,cart_collection}