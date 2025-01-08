import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';

// Middleware function to validate token
const validatetoken = async (req, res, next) => {
  const token = req.cookies.accessToken; 

  logger.info("Validating user before hitting sensitive endpoints");

  if (!token) {
    logger.warn("User doesn't have an access token.");
    return res.status(401).json({
      success: false,
      message: "You are not authorized"
    });
  }

  try {
    // Validate Access Token using JWT Secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // If valid, attach user info to the request and move to the next middleware
    req.user = decoded;

    
    logger.info(`User validated successfully. User ID: ${decoded.userId}`);

    next();
  } catch (error) {
    // Log detailed error for debugging
    if (error instanceof jwt.TokenExpiredError) {
      logger.warn("Access token has expired");
    } else if (error instanceof jwt.JsonWebTokenError) {
      logger.warn("Invalid access token");
    } else {
      logger.error("Unexpected error occurred while verifying token:", error);
    }
    
    // Respond with a generic error message
    res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};

export default validatetoken;
