const mongoose=require('./connection')



const user_schema=new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    role:{type:String,required:true},
    vendor:{type:mongoose.Schema.Types.ObjectId,ref:'vendor'},
    buyer:{type:mongoose.Schema.Types.ObjectId,ref:'buyer'},
    isVerified:{type:Boolean,default:false},
    token:{type:String,default:''},
    address:[{street:String,city:String,pincode:Number,state:String}],
    feedback:[{type:mongoose.Schema.Types.ObjectId,ref:'help'}]
})

const user_collection=new mongoose.model('user',user_schema)


module.exports=user_collection