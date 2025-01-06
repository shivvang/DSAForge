import jwt from "jsonwebtoken";
import crypto from "crypto";
import RefreshToken from "../models/RefreshToken.model.js";

const generateTokens = async(user)=>{
    const accesstoken = jwt.sign({
        userId:user._id,
        userName:user.username,
    },process.env.JWT_SECRET,{expiresIn:'60m'})

    const refreshtoken = crypto.randomBytes(40).toString("hex");

    const expiresIn = new Date();

    expiresIn.setDate(expiresIn.getDate()+7); //refresh token expires in 7 days

    await RefreshToken.create({
        token : refreshtoken,
        user : user._id,
        expiresIn
    })

    return {accesstoken,refreshtoken};
}

export default generateTokens;