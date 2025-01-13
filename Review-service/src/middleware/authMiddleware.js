import logger from "../utils/logger.js";

const authenticatedRequest = (req,res,next)=>{

   logger.info("validating user before hitting the Review routes");

    const  userId = req.headers["x-user-id"];
    
    if(!userId){

        logger.warn("Access to Review  end point without user id");
        
        return res.status(401).json({
            succes:false,
            message:"Authentication required Please Login to Continue",
        });
    }

    req.user = userId; 

    logger.info("User authenticated for problem routes");

    next();
}

export default authenticatedRequest;