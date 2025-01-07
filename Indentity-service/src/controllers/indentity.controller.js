import User from "../models/User.model.js";
import generateTokens from "../utils/generateToken.js";
import logger from "../utils/logger.js";
import {validateLogin, validateRegisteration} from "../utils/validate.js";

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

       
        res.status(201).json({
            success:true,
            message:"user registered successfully",
            user:{
                id:user._id,
                email:user.email,
            }
        });

    } catch (error) {
        logger.error("Registration error occured",error);
        res.status(500).json({
            success:false,
            message:"interal server error"
        })
    }
}

//user login
export const LoginUser = async(req,res)=>{
    logger.info("Login user endpoint hit...");
    try {
        const {error} = validateLogin(req.body);

        if(error){
            logger.warn("Validation error",error.details[0].message);
            return res.status(400).json({
                success:false,
                message: error.details[0].message
            })
        }

        const {email,password} = req.body;

        const user = await User.findOne({email});

        if(!user){
            logger.warn("user doesnt not exist at login");
            return res.status(400).json({
                success:false,
                message: "user do not exist"
            })
        }

        const validPassword = await user.comparePassword(password);

        if(!validPassword){
            logger.warn("wrong password at login");
            return res.status(400).json({
                success:false,
                message: "Invalid Credentials"
            })
        }

        //generate refresh and accesstoken

        const {accesstoken,refreshtoken} = await generateTokens(user);

        const options = {
            httpOnly: true,
            secure: true,
          };
        
          res.status(201).cookie("accessToken", accesstoken, options)
            .cookie("refreshToken", refreshtoken, options).json({
            success:true,
            message:"user logged in successfully",
            user:{
                id:user._id,
                email:user.email,
            }
        });

    } catch (error) {
        logger.error("Login error occured",error);
        res.status(500).json({
            success:false,
            message:"interal server error"
        })
    }
}

export const renewAccessToken = async(req,res)=>{
    logger.info("renew acess token endpoint  is hit ,,,");

    const refreshToken = req.cookies.refreshToken; // Get from HTTP-only cookie

    if (!refreshToken) {
        logger.warn("Refresh token for the user has expired")
        return res.status(401).json({ success: false, message: 'Please re Login again' });
    }

    try {
        
       //still unfinished

    } catch (error) {
        logger.error("error occured in recreating the access token",error);
        res.status(500).json({
            success:false,
            message:"interal server error"
        })
    }
}