import express from "express";

import { setReview } from "../controllers/Review.controller.js";

const ReviewRouter = express.Router();  

ReviewRouter.use(authenticatedRequest);

ReviewRouter.post("/schedule/:problemId",setReview);

export default ReviewRouter;