const mongoose=require('./connection')


const category_schema=new mongoose.Schema({
    image:String,
    category:String
})


const category_collection=new mongoose.model('category',category_schema)


module.exports=category_collection