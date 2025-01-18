import {Worker} from "bullmq";
import Review from "../models/Review.model.js";
import logger from "../utils/logger.js";
import { sendMail } from "../utils/mailer.js";


// a worker that listens for jobs in the "reviewQueue"

const reviewWorker = new Worker("reviewQueue",async(job)=>{

    const { userId, problemId } = job.data;

    try {
        //fetching user details and problem details 
        const review = await Review.findOne({ user: userId, problem: problemId }).populate("user problem");

        if (!review) {
            logger.warn(`Review not found for user ${userId} and problem ${problemId}`);
            return; // Stop processing the job
        }

        if (!review.problem || !review.user) {
            logger.warn(`Incomplete data for user ${userId} and problem ${problemId}`);
            return;
        }

        const body = `
    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd;">
        <h2 style="color: #007bff;">Problem Reminder</h2>
        <p><strong>Title:</strong> ${review.problem.title}</p>
        <p><strong>Description:</strong></p>
        <p style="background: #f4f4f4; padding: 10px; border-radius: 5px;">
            ${review.problem.description}
        </p>
        <p>Make sure to revise this problem!</p>
    </div>
`;

         //sending notification to user 

         await sendMail(review.user.email,body)
         
         // Delete review after notifying
         await Review.findOneAndDelete({ user: userId, problem: problemId });

         logger.info(`Notified user ${userId} to review problem ${problemId}, then deleted the review.`);
    } catch (error) {
        logger.error(`Failed to process review job for user ${userId}:`, error);
    }
},{
    connection: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD
    }
});


reviewWorker.on("completed", (job) => {
    logger.info(`Job ${job.id} completed.`);
});

reviewWorker.on("failed", (job, err) => {
    logger.error(`Job ${job.id} failed:`, err);
});