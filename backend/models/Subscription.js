import mongoose from 'mongoose'
const subscriptionSchema=new mongoose.Schema(
    {
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
            unique:true,
        },
        provider:{
            type:String,
            enum:["razorpay","stripe"],
            required:true,
        },
        last4:String,
        brand:String,
        isDefault:{
            type:Boolean,
            default:false,
        },
    },
    {timestamps:true}
);
export default mongoose.model("Paymentmethod",subscriptionSchema)