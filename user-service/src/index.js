import express, { urlencoded } from "express";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";
import cors from "cors";
import dbConnect from "./config/dbConnect.js";
import authRoutes from "../src/routes/authRoutes.js"
import "./config/passportConfig.js"

dotenv.config();
dbConnect();

const app = express();

//middlewares

const corsOptions={
    origin:["http:/localhost:3000"],
    credentials:true
}

app.use(cors(corsOptions));

app.use(express.json({limit:"100mb"}));

app.use(urlencoded({limit:"100mb",extended:true}));

//session 

//A session stores user-specific data on the server, identified by a unique session ID, 
// allowing the server to remember the user across multiple requests. 

// resave: false: 

// Imagine a session as a box. If you don't put anything in the box during a request, 
// there's no reason to close it and store it again. This option makes sure we don't save the session if nothing in it changed.

// saveUninitialized: false: 

// If you create an empty box (a session) and don't put anything in it, this option prevents it from being saved. 
// It's like not saving an empty box because it's useless. We only save sessions that have data in them.

app.use(session({
    secret:"something crazy for time being",
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge:60000 * 60,
    }
}))

// Passport initialization.

// Intializes Passport for incoming requests, allowing authentication strategies to be applied.
app.use(passport.initialize());


//Middleware that will restore login state from a session.
app.use(passport.session());


//Routes
app.use("/api/auth",authRoutes);


const PORT = process.env.PORT || 7001;



    app.listen(PORT,()=>{
        console.log(`listening to port ${PORT}`)
        });
