import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";
 // protected route token base
 export const requireSignIn= async (req,res,next)=>{
    try{
       const decode=  JWT.verify(
         req.headers.authorization,
         process.env.JWT_SECRET
       );
        req.user=decode;
       next();
    }catch(err){
        console.log(err);
    }
};
export const isAdmin= async (req,res,next)=>{
    try{
          const user= await userModel.findById(req.user._id);
          if(user.role !==1){
              res.status(404).send({
                success:false,
                message:"Unauthorized Access"
              });
          }
          next();

    }catch(err){
        console.log(err);
        res.status(404).send({
             success:false,
             Error:err,
             message:"Error in middleware"
        });
    }
};