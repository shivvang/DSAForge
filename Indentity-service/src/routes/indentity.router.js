import express from "express";

import {LoginUser, Logout, registerUser, renewAccessToken, renewPassword} from "../controllers/indentity.controller.js";

const router = express.Router();

router.post("/register",registerUser);

router.post("/login",LoginUser);

router.post("/renewAccessToken",renewAccessToken);

router.post("/renewPassword",renewPassword);

router.post("/logout",Logout);


export default router;