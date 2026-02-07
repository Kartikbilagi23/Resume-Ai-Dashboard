import mongoose from 'mongoose'

const paymentSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    orderId:{
        type:String,
        required:true,
    },
    paymentId:String,
    signature:String,
    plan:{
        type:String,
        enum:['Free','Pro','Premium'],
        required:true,
    },
    amount:Number,
    status:{
        type:String,
        enum:["created","paid","failed"],
        default:"created",
    },
},
{timestamps:true}
)
export default mongoose.model("Payment",paymentSchema)