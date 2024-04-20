import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from "./../helper/authHelper.js";
import JWT from "jsonwebtoken";

   export const registerController= async (req,res)=>{
        try{
        const {name,email,password,phone,address,answer}=req.body;
        // validation
        if(!name){
            res.send({message:"name is require"});
        }
        if(!email){
            res.send({message:"email is require"});
        }
        if(!password){
            res.send({message:"password is require"});
        }
        if(!phone){
            res.send({message:"phone no. is require"});
        }
        if(!address){
            res.send({message:"address is require"});
        }
        if(!answer){
            res.send({message:"answer is require"});
        }
        // user
        const existingUser=await userModel.findOne({email});
        // existinguser handling
        if(existingUser){
            res.status(200).send(
                {    
                    success:true,
                    message:"your are already registered"
                }
            );
        }
        // register user
        const hashedPassword=await hashPassword(password);
        // create/ post user model
        const user= await new userModel({
            name,
            email,
            phone,
            address,
            password:hashedPassword,
            answer
        }).save();
        res.status(201).send({
            success:true,
            message:"you are successefully registered",
            user
        });

    }catch(err){
         console.log(err);
        res.status(401).send(
            {    
                success:false,
                message:"error in registration"
            }
        )
    }
}
// login controller
export const loginController= async(req,res)=>{
    try{
        const {email,password}=req.body;
        // login validation.
        if(!email || !password){
            res.status(404).send({
                success:false,
                message:"wrong email or password"
            });
        }
        // check user
        const user= await userModel.findOne({email});
        if(!user){
            res.status(404).send({
                success:false,
                message:"your are not registered"
            });
        }
        const match= await comparePassword(password,user.password);
        if(!match){
            res.status(404).send({
                success:false,
                message:"invalid password"
            });
        }
        // token
        const token=  JWT.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:"7d"});
        res.status(200).send(
            {
            success:true,
            message:"login successfully",
            user:{
            _id:user._id,
            name:user.name,
            email:user.email,
            phone:user.phone,
            address:user.address,
            role:user.role
            },
            token,
        });

        
    }catch(err){
        console.log(err);
        res.status(500).send({
            success:false,
            message:"forgot email"
        });
    }
}
// forgot password required.
export const forgotPasswordController= async (req,res)=>{
   try{
      const {email,answer,newPassword}=req.body;
      // validation 
      if(!email){
        res.status(400).send({message:"email is require"});
      }
      if(!answer){
        res.status(400).send({message:"answer is require"});
      }
      if(!newPassword){
        res.status(400).send({message:"newpassword is require"});
      }
      // get user for userModel.
      const user= await userModel.findOne({email,answer});
      // user validation.
      if(!user){
        res.status(400).send({
            success:false,
            message:"may be wrong email or answer",
        })
      }
      const hashed= await hashPassword(newPassword);
      await userModel.findByIdAndUpdate(user._id,{password:hashed});
      res.status(200).send({
         success:true,
         message:"successfully reset password",
      });

   }catch(err){
    console.log(err);
     res.status(404).send({
        success:false,
        message:"some error is occure",
        err
     });
   }
}
// test controller
export const testController= (req,res)=>{
    try{
        res.status(200).send("Route protected");
    }catch(err){
        res.send(err);
    }
}
//  updateProfile
export const updateProfileController= async (req,res)=>{
    try{
         const {name,email,phone,password,address}=req.body;
       
         const user= await userModel.findById(req.user._id);
         const hashedPassword= password ? await hashPassword(password) : undefined;
         const updatedUser= await userModel.findByIdAndUpdate(
            req.user._id,
            {
              name: name || user.name,
              email:email || user.email,
              password:hashedPassword || user.password,
              phone: phone || user.phone,
              address: address || user.address,
         },{new:true});
         res.status(200).send({
            success:true,
            message:"successfully profile updated",
            updatedUser
         })
      
    }catch(error){
        res.status(500).send({
            success:false,
            message:"Error while profile updates",
            error
        });
    }
};
// get Orders
export const getOrdersController= async(req,res)=>{
    try{
      const orders= await orderModel.find({})
      .populate("product","-photo")
      .populate("buyer","name");
      res.json(orders);
    }catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error while get Orders",
            error:error,
        });
    }
}
// get all oders for admin
export const getAllOrdersController= async(req,res)=>{
    try{
      const orders= await orderModel.find({})
      .populate("product","-photo")
      .populate("buyer","name");
      res.json(orders);
    }catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error while get Orders",
            error:error,
        });
    }
};
// update status
export const updateStatusController= async(req,res)=>{
      try{
         const {orderId}=req.params;
         const{status}=req.body;
         const orders= await orderModel.findByIdAndUpdate(orderId,{new:true},{status});
         res.json(orders);
      }catch(error){
        res.status(500).send({
            success:false,
            message:"Error while updating Status",
            Error:error,
        });
      }
}