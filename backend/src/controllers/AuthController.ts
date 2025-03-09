import { NextFunction, Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const signUp=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const {username,email,password}=req.body;
        const user=await User.findOne({email});

        if(user){
            res.status(400).send({message:"User with this email is already registered",success:false});
            return;
        }

        const Usermodel =new User({username,email,password});
        Usermodel.password=await bcrypt.hash(password,10);
        await Usermodel.save();
        res.status(200).send({
            message:"Successfully registerd ! Now login with your credentials",
            success:true
        })
        return; 
    } catch (error) {
        console.log("Error occured: ",error);
        res.status(500).send({message:"Internal Server Error",success:false});
        return; 
    }
}

const login=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const {username,email,password}=req.body;
        const user=await User.findOne({email});

        if(!user){
            res.status(400).send({message:"User is not registered!",success:false});
            return; 
        }
        
        const isPassequal=await bcrypt.compare(password,user.password);
        if(!isPassequal){
            res.status(400).send({message:"Password don't matched",success:false});
            return; 
        }
        
        const jwtToken=jwt.sign(
            {email:user.email,userId:user._id},
            process.env.JWT_SECRET_TOKEN as string,
            {expiresIn:"24h"}
        )
        res.status(200).send({
            message:"Login Successfully!",
            success:true,
            jwtToken,
            email,
            username:user.username,
        })
        return; 
    } catch (error) {
        console.log("Error occured: ",error);
        res.status(500).send({message:"Internal Server Error",success:false});
       return; 
    }
}

export {signUp,login}