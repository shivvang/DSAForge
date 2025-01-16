import express from "express";
import { fetchDueProblems, setReview } from "../controllers/Review.controller.js";
import authenticatedRequest from "../middleware/authMiddleware.js";

const reviewRouter = express.Router();

reviewRouter.use(authenticatedRequest);

reviewRouter.post("/schedule",setReview);

reviewRouter.get("/due",fetchDueProblems);

export default reviewRouter;