import express from 'express'
import auth from '../middleware/authMiddleware.js'
import crypto from 'crypto'
import Payment from '../models/payment.js'
import Subscriptions from '../models/Subscription.js'
const router=express.Router()

router.post('/create-order',auth,async (req,res) => {
    const {plan}=req.body;
    const prices={
        Pro:499,
        Premium:999,
    };
    const order=await razorpay.order.create({
        amount:prices[plan]*100,
        currency:"INR",
    });
    await Payment.create({
        userId:req.body.id,
        orderId:order.id,
        amount:order.amount,
        plan,
    });
    res.json(order);
});
router.post("/verify",auth,async(req,res)=>{
    try{
    const {razorpay_order_id,razor_payment_id,razorpay_sign}=req.body;
    const body=razorpay_order_id+"|"+razor_payment_id;
    const expected=crypto.createHmac("sha256",process.env.RAZORPAY_SECRET)
    .update(body)
    .digest("hex");
    if(expected!==razorpay_sign){
        return res.status(400).json({message:"Invalid signature"});
    }
    const payment=await Payment.findOneAndUpdate(
        {
            orderId:razorpay_order_id
        },
        {
            paymentId:razor_payment_id,
            signature:razorpay_sign,
            status:"paid",
        },
        {new:true}
    );
    if(!payment){
        return res.status(404).json({message:'Payment not found'})
    }
    // Update/Create subscription
    await Subscriptions.findOneAndUpdate(
        {userId:req.user.id},
        {
            plan:payment.plan,
            startedAt:new Date(),
            expiresAt: new Date(
                Date.now()+30*24*60*60*1000
            ),
            status:"active",
        },
        {upsert:true}
    );
    res.json({success:true});
}  catch(err){
    console.log(err);
    res.status(500).json({message:"Payment verification failed"})
}
})
export default router;