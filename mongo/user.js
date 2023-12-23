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
        isVerified:{type:Boolean,default:false},
        role:{type:String,required:true},
        vendor:{type:mongoose.Schema.Types.ObjectId,ref:'vendors'},
        buyer:{type:mongoose.Schema.Types.ObjectId,ref:'buyers'}
    }
,{timestamps:true})

const productSchema=new mongoose.Schema(
    {
       
        name:{type:String,required:true,trim:true},
        description:{type:String,required:true},
        price:{type:Number,required:true,min:0},
        quantity:{type:Number,required:true,min:0},
        category:{type:String,required:true,trim:true},
        image:{type:String,trim:true},
        vendor:{type:mongoose.Schema.Types.ObjectId,ref:'vendors'},
        category:{main:{type:String,required:true},sub:{type:String,required:true}},
        orders:[{type:mongoose.Schema.Types.ObjectId,ref:'orders'}]
    }
,{timestamps:true})

const orderSchema = new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', 
        required: true,
      },
      products: [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'products', 
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
          },
        },
      ],
      totalPrice: {
        type: Number,
        required: true,
      },
      orderDate: {
        type: Date,
        default: Date.now,
      },
      shippingAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'address',
      },
    }
  );

const addressSchema = new mongoose.Schema({
    street_address: String,
    city: {type:String,required:true},
    state: String,
    pincode: {type:String,required:true},
    country: String
  });

 
  
 
  
  const cartItemSchema = new mongoose.Schema({
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'products',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
  });
  
  const cartSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    items: [cartItemSchema],
    totalPrice: {
      type: Number,
      required: true,
    },
  }, { timestamps: true });
  

  

const user_collection=new mongoose.model('users',userSchema)
const product_collection=new mongoose.model('products',productSchema)
const order_collection=new mongoose.model('orders',orderSchema)
const address_collection=new mongoose.model('address',addressSchema)
const cart_collection = new mongoose.model('carts', cartSchema);


module.exports={user_collection,product_collection,order_collection,address_collection,cart_collection,mongoose}