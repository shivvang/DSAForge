import User from "../models/User.model.js";
import generateTokens from "../utils/generateToken.js";
import logger from "../utils/logger.js";
import {validateRegisteration} from "../utils/validate.js";

//user registeration
export const registerUser = async(req,res)=>{
    logger.info("Registeration endpoint hit...");
    try {
        const {error} = validateRegisteration(req.body);

        if(error) {
            logger.warn("Validation error",error.details[0].message);
            return res.status(400).json({
                success:false,
                message: error.details[0].message
            })
        }

        const {email,password,username} = req.body;

        let user = await User.findOne({$or:[{email},{username}]});

        if(user){
            logger.warn("user already exist");
            return res.status(400).json({
                success:false,
                message:"User already exists"
            })
        }

        user = new User({username,email,password});

        await user.save();

        logger.warn("user saved successfully",user._id);

        const {accesstoken,refreshtoken} = generateTokens(user);

        res.status(201).json({
            success:true,
            message:"user registered successfully",
            accesstoken,
            refreshtoken
        });

    } catch (error) {
        logger.error("Registration error occured",error);
        res.status(500).json({
            success:false,
            message:"interal server error"
        })
    }
}