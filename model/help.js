const mongoose=require('./connection')



const help_schema=new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    subject:String,
    message:String,
    user:{type:mongoose.Schema.Types.ObjectId,ref:'user'}
})


const help_collection=new mongoose.model('help',help_schema)



module.exports=help_collection