import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import problemRouter  from "./rotues/problem.router.js";
import errorHandler from "./middleware/errorHandler.js";
import logger from "./utils/logger.js";
import Redis from "ioredis";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 8002;

mongoose.connect(process.env.MONGODB_URI).then(()=>logger.info("Connected to Mongo Db")).catch((err)=>logger.error("Mongo db connection",err));

const cacheClient = new Redis(process.env.REDIS_URL);

//middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

app.use((req,res,next)=>{
    logger.info(`Recieved ${req.method} request to ${req.url}`);
    logger.info(`Request Body , ${req.body}`);
    next();
})


app.use("/api/problem",(req,res,next)=>{
    req.cacheClient = cacheClient;
    next();
},problemRouter);

app.use(errorHandler);

app.listen(PORT,()=>{
    logger.info(`Problem service running on port ${PORT}`);
})

process.on("unhandledRejection",(reason,promise)=>{
    logger.error("unhandled Rejection at",promise,"reason",reason);
})

