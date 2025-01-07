import express from "express";

import {LoginUser, registerUser, renewAccessToken} from "../controllers/indentity.controller.js";

const router = express.Router();

router.post("/register",registerUser);
router.post("/login",LoginUser);
router.post("/renewAccessToken",renewAccessToken);

export default router;