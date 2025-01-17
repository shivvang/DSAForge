import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import problemRouter  from "./rotues/problem.router.js";
import errorHandler from "./middleware/errorHandler.js";
import logger from "./utils/logger.js";
import cookieParser from "cookie-parser";
import {initializeRabbitMQ} from "./utils/rabbitmq.js";

const app = express();
const PORT = process.env.PORT || 8002;

mongoose.connect(process.env.MONGODB_URI).then(()=>logger.info("Connected to Mongo Db")).catch((err)=>logger.error("Mongo db connection",err));



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


app.use("/api/problem",problemRouter);

app.use(errorHandler);

async function launchProblemService() {
    try {
        // Initialize RabbitMQ connection
        await initializeRabbitMQ();
        // Start the Express server
        app.listen(PORT, () => {
            logger.info(`🚀 Problem Service is live at http://localhost:${PORT}`);
        });

    } catch (error) {
        logger.error("❌ Critical Error: Failed to launch Problem Service.", error);
        process.exit(1); // Exit the process if the server fails to start
    }
}

// Start the service
launchProblemService();


process.on("unhandledRejection",(reason,promise)=>{
    logger.error("unhandled Rejection at",promise,"reason",reason);
})

