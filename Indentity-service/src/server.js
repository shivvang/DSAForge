import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import logger from "./utils/logger.js";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import  { RateLimiterRedis } from "rate-limiter-flexible";
import ratelimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import Redis from "ioredis";
import identityRouter from "./routes/indentity.router.js";
import errorHandler from "./middleware/errorHandler.js"
const app = express();
const PORT = process.env.PORT || 8001;

mongoose.connect(process.env.MONGODB_URI).then(()=>logger.info("Connected to Mongo Db")).catch((err)=>logger.error("Mongo db connection",err));

const cacheClient = new Redis(process.env.REDIS_URL);

//middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

app.use((req,res,next)=>{
    logger.info(`Recieved ${req.method} request to ${req.url}`);
    logger.info(`Request Body , ${req.body}`);
    next();
})

// DDOS Protection & Global Rate Limiting
// RateLimiterRedis → Prevents abuse by limiting requests globally.
// Allows 10 requests per second per IP address.
//If exceeded: Logs a warning and sends a 429 Too Many Requests response.

const globalRateLimiter  = new RateLimiterRedis({
    storeClient: cacheClient,
    keyPrefix:"middleware",
    points: 10,
    duration:1
});



app.use((req,res,next)=>{
    globalRateLimiter.consume(req.ip).then(()=>next()).catch((err)=>logger.warn(`Rate limit exceeded for Ip: ${req.ip}`));

res.status(429).json({
    success:false,
    message:"too many request"
})
})


// Sensitive Route Rate Limiting
// express-rate-limit + RedisStore → Protects sensitive endpoints (e.g., /api/auth/register).
// Allows 50 requests per 15 minutes per IP address.
// If exceeded: Logs a warning and returns a 429 Too Many Requests response.

const  sensitiveRouteLimiter = ratelimit({
    windowMs:15 * 60 * 1000,
    max:50,
    standardHeaders:true,
    legacyHeaders:false,
    handler: (req,res,next)=>{
        logger.warn(`sensitive end point rate limit exceeded for Ip :${req.ip}`);
        res.status(429).json({success:false,message:"too many requests"});
    },
    store: new RedisStore({
        sendCommand:(...args) => cacheClient.call(...args),
    })
})

//apply sensitive endpoint limiter to routes
app.use("/api/auth/register", sensitiveRouteLimiter);

//Routes
app.use("/api/auth",identityRouter);

//error handler 
app.use(errorHandler);

app.listen(PORT,()=>{
    logger.info(`Identity service running on port ${PORT}`);
})

//unhandled promise rejection 
// Captures any unhandled promise errors (e.g., database disconnect).
// Logs them and prevents the app from crashing unexpectedly.

process.on("unhandledRejection",(reason,promise)=>{
    logger.error("unhandled Rejection at",promise,"reason",reason);
})