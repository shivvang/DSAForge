import {Router} from "express";
import passport from "passport";
import {  loginUser, logoutUser, regenerateSession, registerUser, reset2fa, setup2fa, verify2fa } from "../controllers/auth.controller.js";
import { verifyUser } from "../middleware/verifyuser.js";

const router = Router();


//Registration route
router.post("/register",registerUser);

//Login route
router.post("/login",passport.authenticate("local"),loginUser);

//renew session token
router.get("/refresh",regenerateSession);

//Logout Route
router.post("/logout",logoutUser);


//2Fa Setup

router.post("/2fa/setup",verifyUser,setup2fa);

//verify Route

router.post("/2fa/verify",verifyUser,verify2fa);

//Reset Router

router.post("/2fa/reset", verifyUser,reset2fa);

export default router;