import express from "express";
import { fetchDueProblems, setReview } from "../controllers/Review.controller.js";

const reviewRouter = express.Router();

reviewRouter.post("/schedule",setReview);

reviewRouter.get("/due",fetchDueProblems);

export default reviewRouter;