import {Router} from "express";
import passport from "passport";
import { authStatus, loginUser, logoutUser, registerUser, reset2fa, setup2fa, verify2fa } from "../controllers/auth.controller.js";

const router = Router();


//Registration route
router.post("/register",registerUser);

//Login route
router.post("/login",passport.authenticate("local"),loginUser);

//Auth Status Route
router.get("/status",authStatus);

//Logout Route
router.post("/logout",logoutUser);


//2Fa Setup

router.post("/2fa/setup",setup2fa);

//verify Route

router.post("/2fa/verify",verify2fa);

//Reset Router

router.post("/2fa/reset", reset2fa);

export default router;