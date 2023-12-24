const mongoose=require('./connection')


const product_schema=new mongoose.Schema({
    name:{type:String,required:true},
    brand:String,
    color:String,
    price:{type:Number,required:true},
    quantity:{type:Number,required:true,default:0},
    vendor:{type:mongoose.Schema.Types.ObjectId,ref:'vendor'},
    image:String,
    order:{type:mongoose.Schema.Types.ObjectId,ref:'order'},
    main_category:String,
    sub_category:String
})

const product_collection=new mongoose.model('product',product_schema)



module.exports=product_collection