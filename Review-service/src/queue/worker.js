import {Worker} from "bullmq";
import Redis from "ioredis";
import Review from "../models/Review.model.js";
import logger from "../utils/logger.js";

const redisConnection = new Redis(process.env.REDIS_URL);

// a worker that listens for jobs in the "reviewQueue"

const reviewWorker = new Worker("reviewQueue",async(job)=>{

    const { userId, problemId, difficulty } = job.data;

    try {
        //fetching user details and problem details 


         //sending notification to user 

         
         // Delete review after notifying
         await Review.findOneAndDelete({ user: userId, problem: problemId });

         logger.info(`Notified user ${userId} to review problem ${problemId}, then deleted the review.`);
    } catch (error) {
        logger.error(`Failed to process review job for user ${userId}:`, error);
    }
})