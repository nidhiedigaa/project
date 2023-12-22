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
        address: { type: mongoose.Schema.Types.ObjectId, ref: 'address' }
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

  const vendorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
  
  }, { timestamps: true });
  
 
  
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
const vendor_collection = new mongoose.model('vendors', vendorSchema);

module.exports={user_collection,product_collection,order_collection,address_collection,vendor_collection,cart_collection}