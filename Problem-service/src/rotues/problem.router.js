import express from "express";

import { createProblem, deleteProblem, getAllProblems, getProblem, updateProblem } from "../controllers/Problem.controller.js";

import authenticatedRequest from "../middleware/authMiddleware.js";

const router = express.Router();

//middleware -> will check whether user is authenticated or not 

router.use(authenticatedRequest);

router.post("/createProblem",createProblem);

router.get("/allProblems",getAllProblems);

router.get("/findProblem/:id",getProblem);

router.patch("/updateProblem/:id",updateProblem);

router.delete("/deleteProblem/:id",deleteProblem);

export default router;