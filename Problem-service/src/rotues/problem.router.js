import express from "express";

import { createProblem, deleteProblem, updateProblem } from "../controllers/Problem.controller.js";

import authenticatedRequest from "../middleware/authMiddleware.js";

const router = express.Router();

//middleware -> will check whether user is authenticated or not 

router.use(authenticatedRequest);

router.post("/createProblem",createProblem);

router.patch("/updateProblem/:id",updateProblem);

router.delete("/deleteProblem/:id",deleteProblem);

export default router;