import  config  from "../config.js";
import { User } from "../model/user.model.js";
import jwt from "jsonwebtoken";

export const signup = async(req,res)=>{
    const {userName,email,password} = req.body;
    try {
        const user =await User.findOne({email:email})
        if(user){
            return res.status(400).json({errors:"User already exists"})
        }

        const newUser = new User({
            userName,
            email,
            password
        })

        await newUser.save()
        return res.status(200).json({message:"new user created"})
    } catch (error) {
        console.log("Error in signup:", error);
        return res.status(400).json({errors:"Error in signup"})
    }
};

export const login =async (req,res)=>{
    const {email,password} = req.body;
    try {
        const user =await User.findOne({email:email});
        if(!user){
            return res.status(400).json({errors:"User not found"});
        }
        else if (password !== user.password) {
            
            return res.status(400).json({ errors: "Invalid email or password" });
        }
        else{
            //JWT TOKEN
            const token = jwt.sign({id:user._id}, config.JWT_USER_PASSWORD,{
                expiresIn:"1d",
            });
            const cookieOptions ={
                expires:new Date(Date.now()+24*60*60*1000),
                httpOnly:true,
                secure:process.env.NODE_ENV==="production",
                sameSite:"Strict"
            }
            res.cookie("jwt",token,cookieOptions);
            return res.status(200).json({message:"User logged in",user,token});
        }
    } catch (error) {
        console.log("Error in login:", error);
        return res.status(400).json({errors:"Error in login"})
    }
};

export const logout = (req,res)=>{
    try {
        res.clearCookie("jwt");
        return res.status(200).json({message:"User logged out"});
    } catch (error) {
        return res.status(400).json({errors:"Error in logout"})
    }
};