import Review from "../models/Review.model.js";
import { reviewQueue } from "../queue/bullmq.js";
import logger from "../utils/logger.js";
import Joi  from "joi";

const getReviewTime = (difficulty) => {
    const daysMap = { easy: 3, medium: 7, hard: 15 };
    return new Date(Date.now() + daysMap[difficulty] * 24 * 60 * 60 * 1000);
};


export const setReview = async (req, res) => {
    logger.info("Set Review endpoint hit.");
    try {
        const { userId } = req.user;
        const {problemId} = req.params;

        if (!userId) {
            logger.warn("Missing user ID in request.");
            return res.status(400).json({
                success: false,
                message: "User ID is required.",
            });
        }
        if (!problemId) {
            logger.warn("Missing problem ID in request.");
            return res.status(400).json({
                success: false,
                message: "Problem ID is required.",
            });
        }
        const schema = Joi.object({
            difficulty: Joi.string()
                .valid("easy", "medium", "hard")
                .required()
                .messages({
                    "any.required": "Difficulty is required.",
                    "string.base": "Difficulty must be a string.",
                    "any.only": "Difficulty must be one of 'easy', 'medium', or 'hard'.",
                }),
        });

        const { error, value } = schema.validate(req.body);

        if (error) {
            logger.warn(`Validation error: ${error.message}`);
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
        const { difficulty } = value;

        const delay  = getReviewTime(difficulty);

        // Add the review job to the queue with the delay
        await reviewQueue.add("reviewReminder", {
            userId,
            problemId,
            difficulty,
        }, {
            delay: delay, // Delay in milliseconds
            removeOnComplete: true,
            removeOnFail: true,
        });

        logger.info(`Review scheduled for user ${userId} on problem ${problemId} after ${delay / 1000 / 60 / 60} hours.`);


        const newReview = await Review({
            user:userId,
            problem:problemId,
            onReview:true,
            difficulty
        }).save();

        logger.info("Review successfully set.");
        return res.status(201).json({
            success: true,
            message: "Review successfully set.",
            review: newReview,
        });

    } catch (error) {
        logger.error("Error setting review:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while setting the review.",
        });
    }
};