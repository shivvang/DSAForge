import jwt from "jsonwebtoken";
import crypto from "crypto";
import RefreshToken from "../models/RefreshToken.model.js";


const generateTokens = async(user)=>{
   
    const accesstoken = jwt.sign({
        userId:user._id,
        userName:user.username,
    },process.env.JWT_SECRET,{expiresIn:'60m'})

   
    const refreshtoken = crypto.randomBytes(40).toString("hex");

    console.log("what is this guys problem",refreshtoken);

    const expiresIn = new Date();

    expiresIn.setDate(expiresIn.getDate()+7); //refresh token expires in 7 days

    try {
        
    await RefreshToken.create({
        token : refreshtoken,
        user : user._id,
        expiresIn
    })

    } catch (error) {
        logger.warn(`error generating referesh and accestoken`,error);
        res.status(429).json({success:false,message:"Something went wrong while processing your request. Please try again later"});
    }
    return {accesstoken,refreshtoken};
}

export default generateTokens;