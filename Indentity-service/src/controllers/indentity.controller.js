
import User from "../models/User.model.js";
import generateTokens from "../utils/generateToken.js";
import logger from "../utils/logger.js";
import {validateLogin, validateRegisteration, validateRenewPass} from "../utils/validate.js";
import jwt from "jsonwebtoken";

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

        const {accesstoken,refreshtoken} =  generateTokens(user);

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: 'strict', // Prevent CSRF attacks
          };
        
          logger.warn("user logged in successfully",user._id);

          res.status(201).cookie("accessToken", accesstoken, {...options, maxAge: 2 * 60 * 60 * 1000})
            .cookie("refreshToken", refreshtoken, {...options,maxAge: 7 * 24 * 60 * 60 * 1000}).json({
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
    logger.info("renew acess token endpoint  is hit");
    

    const refreshToken = req.cookies.refreshToken; 

    if (!refreshToken) {
        logger.warn("referesh token of user is expired and now he will relogin");

        return res.status(401).json({ success: false, message: 'Please re login again session is expired' });
    }

    try {
        
        const decoded =  jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET);


        const newAccessToken = jwt.sign({userId:decoded.userId},process.env.JWT_SECRET ,{expiresIn:'120m'});

    
        const options = {
            httpOnly: true,
            secure: true,
            sameSite: 'strict', // Prevent CSRF attacks
          };

        logger.warn("ReCreated User's Access token");

        return res.status(201).cookie("accessToken", newAccessToken, {...options,maxAge: 2 * 60 * 60 * 1000}).json({
            success:true,
            message:"Acces token recreated",
        });

    }  catch (error) {
        logger.error("error occured in recreating the access token",error);
        res.status(500).json({
            success:false,
            message:"interal server error"
        })
    }
}

export const Logout = async (req, res) => {
    logger.info("Logout endpoint hit...");

    try {
        // Clear the cookies for accessToken and refreshToken
        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: true,
            sameSite: "strict"
        });

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
            sameSite: "strict"
        });

        logger.info("User logged out successfully");

        res.status(200).json({
            success: true,
            message: "User logged out successfully",
        });
    } catch (error) {
        logger.error("Error logging out", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


export const renewPassword = async (req, res) => {
    logger.info("🔄 Password renewal endpoint hit...");

    try {
        // Check if accessToken is present in the cookies
        if (!req.cookies.accessToken) {
            if (req.cookies.refreshToken) {
                logger.warn("❌ Access token expired, attempting to use refresh token...");

                // Extract and validate request body
                const { email, password, newPassword } = req.body;
                const { error } = validateRenewPass({ email, password, newPassword });

                if (error) {
                    logger.error("🚫 Invalid input: " + error.details[0].message);
                    return res.status(400).json({
                        success: false,
                        message: "Failed to renew password due to invalid input.",
                    });
                }

                // Find user and check password
                const user = await User.findOne({ email });

                if (!user) {
                    logger.warn(`❌ User with email ${email} not found`);
                    return res.status(404).json({
                        success: false,
                        message: "User not found.",
                    });
                }

                const isCorrectOrNot = await user.comparePassword(password);

                if (!isCorrectOrNot) {
                    logger.warn("❌ Incorrect current password entered.");
                    return res.status(400).json({
                        success: false,
                        message: "Incorrect current password.",
                    });
                }

                // Update the password
                user.password = newPassword;
                await user.save();

                logger.info("✅ Password successfully updated for user " + email);
                return res.status(200).json({
                    success: true,
                    message: "Password updated successfully.",
                });
            } else {
                logger.warn("❌ Refresh token missing, unable to proceed.");
                return res.status(401).json({
                    success: false,
                    message: "Session expired. Please log in again.",
                });
            }
        }

        // If accessToken is valid, allow password update directly
        const { email, password, newPassword } = req.body;
        const { error } = validateRenewPass({ email, password, newPassword });

        if (error) {
            logger.error("🚫 Invalid input: " + error.details[0].message);
            return res.status(400).json({
                success: false,
                message: "Failed to renew password due to invalid input.",
            });
        }

        // Find user and validate current password
        const user = await User.findOne({ email });

        if (!user) {
            logger.warn(`❌ User with email ${email} not found`);
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        const isCorrectOrNot = await user.comparePassword(password);

        if (!isCorrectOrNot) {
            logger.warn("❌ Incorrect current password entered.");
            return res.status(400).json({
                success: false,
                message: "Incorrect current password.",
            });
        }

        // Update the password
        user.password = newPassword;
        await user.save();

        logger.info("✅ Password successfully updated for user " + email);
        return res.status(200).json({
            success: true,
            message: "Password updated successfully.",
        });

    } catch (error) {
        logger.error("❌ Error renewing password: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error. Please try again later.",
        });
    }
};
