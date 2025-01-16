import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import reviewRouter  from "./rotues/review.router.js"
import errorHandler from "./middleware/errorHandler.js";
import logger from "./utils/logger.js";
import cookieParser from "cookie-parser";
import { initializeRabbitMQ } from "../../Problem-service/src/utils/rabbitmq.js";
import { consumeEvents } from "./utils/rabbitmq.js";
import {handleProblemDeletion} from "./eventHandlers/handleEvent.js"

const app = express();
const PORT = process.env.PORT || 8003;

mongoose.connect(process.env.MONGODB_URI).then(()=>logger.info("Connected to Mongo Db")).catch((err)=>logger.error("Mongo db connection",err));


//middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

// Log incoming requests
app.use((req, res, next) => {
    logger.info(`Received ${req.method} request to ${req.url}`);
    if (Object.keys(req.body).length) logger.info(`Request Body: ${JSON.stringify(req.body)}`);
    next();
});


// Routes
app.use("/api/review", reviewRouter);

// Global error handler
app.use(errorHandler);


async function launchReviewService() {
    try {
        // Initialize RabbitMQ connection
        await initializeRabbitMQ();


        await consumeEvents('problem.deleted',handleProblemDeletion);


        // Start the Express server
        app.listen(PORT, () => {
            logger.info(`🚀 Review Service is live at http://localhost:${PORT}`);
        });

    } catch (error) {
        logger.error("❌ Critical Error: Failed to launch Problem Service.", error);
        process.exit(1); // Exit the process if the server fails to start
    }
}

// Start the service
launchReviewService();


process.on("unhandledRejection",(reason,promise)=>{
    logger.error("unhandled Rejection at",promise,"reason",reason);
})

