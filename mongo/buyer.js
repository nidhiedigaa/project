const {mongoose}=require('./user')


const buyer_schema=new mongoose.Schema(
    {
        details:{type:mongoose.Schema.Types.ObjectId,ref:'users'},
        orders:{type:mongoose.Schema.Types.ObjectId,ref:'orders'},
        address:{type:mongoose.Schema.Types.ObjectId,ref:'address'}
    }
)

const buyers_collection=new mongoose.model('buyers',buyer_schema)



module.exports=buyers_collection