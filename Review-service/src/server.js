import dotenv from "dotenv";
dotenv.config();
import express from "express";
import helmet from "helmet";
import cors from "cors";
import mongoose from "mongoose";
import logger from "./utils/logger.js";
import errorHandler from "./middleware/errorHandler.js";
import { initializeRabbitMQ } from "./utils/rabbitmq.js";
import ReviewRouter from "./routes/Review.router.js";


const app = express();
const PORT = process.env.PORT || 8003;
mongoose.connect(process.env.MONGODB_URI).then(()=>logger.info("connected to db")).catch((err)=>logger.error(err));



app.use(express.json())
app.use(cors());
app.use(helmet());  
app.use(errorHandler);



app.use((req,res,next)=>{
    logger.info(`Recieved ${req.method} request to ${req.url}`);
    logger.info(`Request Body , ${req.body}`);
    next();
})

app.use("/api/reviews",ReviewRouter);

async function launchReviewService(){
   try {

    await initializeRabbitMQ();

    app.listen(PORT, ()=> {
        logger.info(`🚀 Review Service is live at http://localhost:${PORT}`);
    })

   } catch (error) {
    logger.error("❌ Critical Error: Failed to launch Review Service.", error);
    process.exit(1); // Exit the process if the server fails to start
   }
}

launchReviewService();


process.on("unhandledRejection",(reason,promise)=>{
    logger.error("unhandled Rejection at",promise,"reason",reason);
})
