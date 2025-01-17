import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import Redis from "ioredis";
import helmet from "helmet";
import {RedisStore} from "rate-limit-redis"
import  {rateLimit} from "express-rate-limit";
import logger from "./utils/logger.js"
import proxy from "express-http-proxy"
import errorHandler from "./middleware/errorHandler.js";
import validatetoken from "./middleware/authenticateUser.js";
import cookieparser  from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 8000;

const cacheClient = new Redis(process.env.REDIS_URL);

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(cookieparser());

// rateLimit is a function from a library like express-rate-limit, used to limit the number of requests that a client (identified by IP) 
// can make to an API within a certain time window.

//So, each IP can make 100 requests within 15 minutes.


//why use Redis store ?

// Imagine you have a large-scale application with multiple instances running across different servers.

// If you just used in-memory storage (like JavaScript objects) for rate limiting, each server would only know the rate limits for requests it receives.

//  This means if a client makes a request to one server and another request to a different server, the rate limit would not be shared.

// To solve this, Redis is used because it can be accessed from any instance of your app, ensuring that the rate limit is the same across all instances. 

// Redis acts as a central store for rate-limiting data, ensuring consistency.


//Redis will store the number of requests this IP has made in the current time window.
const apiRateLimiter  = rateLimit({
    windowMs:15 * 60 * 1000,
    max:100,
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

// What is sendCommand: (...args) => cacheClient.call(...args) doing?

// custom function that the Redis store uses to communicate with Redis

// Summary:

// sendCommand is a function that allows the rate-limiting middleware to talk to Redis.

// args represents the commands and parameters needed for Redis operations (like incrementing a counter or getting the current request count).

// cacheClient.call(...args) dynamically sends the correct Redis command using the args provided.


// Expiry Time:

// Redis automatically expires this data after 15 minutes (because of the windowMs setting), 
// meaning the client can make new requests after the window is over, and the counter is reset.

// standardHeaders: true

// When set to true, this will include rate-limit information in the response headers (X-RateLimit-Limit, X-RateLimit-Remaining).
// This is useful for clients to know how many requests they have left in the current window.


// legacyHeaders: false

// This disables legacy rate limit headers (X-RateLimit-*) that some older versions of the library used.

// handler: (req, res, next) => { ... }

// This is a custom handler for when the rate limit is exceeded (i.e., when an IP exceeds 100 requests in 15 minutes).


app.use(apiRateLimiter );

// Summary in Simple Terms

// Redis Store keeps track of how many requests an IP has made within a time window (15 minutes in your case).
// It stores this count centrally in Redis so that even if your app is running on multiple servers, they all check the same data.
// When the limit is exceeded (more than 100 requests in 15 minutes), Redis helps block further requests from that IP by
//  making the rate-limiting middleware respond with a 429 Too Many Requests error.

app.use((req,res,next)=>{
    logger.info(`Recieved ${req.method} request to ${req.url}`);
    logger.info(`Request Body , ${req.body}`);
    next();
})


// Overall Workflow

// Request Received:

// A client makes a request to /v1/auth/register.
// Path Transformation:

// proxyReqPathResolver rewrites it to /api/auth/register.

// Header Adjustment:

// proxyReqOptDecorator ensures Content-Type is set to application/json.

// Proxy Forwarding:

// The request is sent to the Identity Service at IDENTITY_SERVICE_URL/api/auth/register.

// Response Handling:

// The Identity Service processes the request and sends a response.

// Logging Response:

// userResDecorator logs the status code from the Identity Service.

// Final Response:

// The response is forwarded back to the client.

// Error Handling (If Any):

// If an error occurs during proxying, proxyErrorHandler captures it, logs it, and sends a 500 error response.


const proxyOptions = {
    proxyReqPathResolver:(req)=>{
        return req.originalUrl.replace(/^\/v1/,"/api")
    },
    proxyErrorHandler:(err,res,next)=>{
        logger.error(`Proxy Error : ${err.message}`);
        res.status(500).json({message:"Internal server error",error:err.message})
    }
}

//identity service proxy
app.use("/v1/auth",proxy(process.env.IDENTITY_SERVICE_URL,{
    ...proxyOptions,
    proxyReqOptDecorator:(proxyReqOpts,srcReq)=>{
        proxyReqOpts.headers["Content-Type"] = "application/json"
        return proxyReqOpts;
    },
    userResDecorator:(proxyRes,proxyResData,userReq,userRes)=>{
        logger.info(`Response received from Indentity services : ${proxyRes.statusCode}`)
        return proxyResData;
    }
}))

//problem service proxy
app.use("/v1/problem",validatetoken,proxy(process.env.PROBLEM_SERVICE_URL,{
    ...proxyOptions,
    proxyReqOptDecorator:(proxyReqOpts,srcReq)=>{
        proxyReqOpts.headers["Content-Type"] = "application/json",
        proxyReqOpts.headers["x-user-id"] = srcReq.user.userId
        return proxyReqOpts;
    },
    userResDecorator:(proxyRes,proxyResData,userReq,userRes)=>{
        logger.info(`Response received from Problem services : ${proxyRes.statusCode}`)
        return proxyResData;
    }
}))


//review service proxy


app.use(errorHandler);

app.listen(PORT,()=>{
    logger.info(`Api Gateway is running on port ${PORT}`);
    logger.info(`Identity service running on  ${process.env.IDENTITY_SERVICE_URL}`);
    logger.info(`Problem service running on  ${process.env.PROBLEM_SERVICE_URL}`);
    logger.info(`Redis is running on  ${process.env.REDIS_URL}`);
})