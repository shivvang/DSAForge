import Review from "../models/Review.model.js";
import logger from "../utils/logger.js";

const Joi = require("joi");

export const setReview = async (req, res) => {
    logger.info("Set Review endpoint hit.");

    try {
        const { userId } = req.user;
        const problemId = req.query.problemId;

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

        let nextReviewTime;
        const currentTime = Date.now();

        if (difficulty === "hard") {
            nextReviewTime = currentTime + 3 * 24 * 60 * 60 * 1000; // 3 days in ms
        } else if (difficulty === "medium") {
            nextReviewTime = currentTime + 7 * 24 * 60 * 60 * 1000; // 7 days in ms
        } else {
            nextReviewTime = currentTime + 15 * 24 * 60 * 60 * 1000; // 15 days in ms
        }

        const newReview = await new Review({
            user: userId,
            problem: problemId,
            difficulty: difficulty,
            isReviewed: true,
            nextReviewTime: new Date(nextReviewTime),
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


export const fetchDueProblems = async (req, res) => {
    logger.info("Fetch due review endpoint hit.");

    try {
        // Find due reviews

        const today = new Date();
        today.setHours(0, 0, 0, 0); 

        const dueReviews = await Review.find({ nextReviewTime: today }).populate("user problem");

        if (!dueReviews.length) {
            logger.warn("No due reviews found.");
            return res.status(404).json({ success: false, message: "No due reviews found." });
        }

        // Send emails for each review
        
        for (const review of dueReviews) {
            const userEmail = review.user.email; 
            const problem = review.problem; 

            const subject = "Chief, you're supposed to revise this problems!";
            const body = {
                problemTitle: problem.title,
                problemDescription: problem.description,
            };

            await sendMail("your-email@example.com", userEmail, subject, body);

            Review.deleteOne(review);
        }

        logger.info("Emails sent for all due reviews.");
        return res.status(200).json({ success: true, message: "Emails sent for due reviews." });
    } catch (error) {
        logger.error("Error fetching due reviews:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching due reviews.",
        });
    }
};