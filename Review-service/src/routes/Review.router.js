import express from "express";

import { sendTestEmail, setReview } from "../controllers/Review.controller.js";
import authenticatedRequest from "../middleware/authMiddleware.js";

const ReviewRouter = express.Router();  

ReviewRouter.use(authenticatedRequest);

ReviewRouter.post("/schedule/:problemId",setReview);

ReviewRouter.post("/sendmailtest",sendTestEmail);

export default ReviewRouter;