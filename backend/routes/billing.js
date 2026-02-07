import auth from "../middleware/authMiddleware"
import express from 'express'

const router=express.Router()

router.get('/',auth,async(req,res)=>{
    let sub=await Subscriptions.findOne({useId:req.user.id});
    if(!sub){
        sub=await Subscriptions.create({
            userId:req.user.id,
            plan:"Free",
        });
    }
    res.json(sub);
})
export default router