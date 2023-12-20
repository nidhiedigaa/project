const mongoose=require('mongoose')


mongoose.connect(process.env.DB_URL)
.then(()=>console.log('connected to the database'))
.catch((error)=>console.log('could not connect to the database'))



const userSchema=new mongoose.Schema(
    {
        name:{type:String,required:true},
        email:{type:String,required:true},
        password:{type:String,required:true},
        token:{type:String,default:''},
        isVerified:{type:Boolean,default:false}
    }
,{timestamps:true})

const productSchema=new mongoose.Schema(
    {
        name:{type:String,required:true,trim:true},
        description:{type:String,required:true},
        price:{type:Number,required:true,min:0},
        quantity:{type:Number,required:true,min:0},
        category:{type:String,required:true,trim:true},
        image:{type:String,trim:true}
    }
,{timestamps:true})


const user_collection=new mongoose.model('users',userSchema)
const product_collection=new mongoose.model('products',productSchema)



module.exports={user_collection,product_collection}