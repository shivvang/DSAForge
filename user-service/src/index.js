import express, { urlencoded } from "express";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import dbConnect from "./config/dbConnect.js";
import authRoutes from "../src/routes/authRoutes.js"
import "./config/passportConfig.js"

dotenv.config();
dbConnect();

const app = express();

//middlewares

app.use(helmet())

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
    secret:process.env.SESSION_SECRET || "something crazy idk",
    resave:false,
    saveUninitialized:false,
    cookie:{
        httpOnly:true,
        secure: process.env.NODE_ENV === "production", // Only true in production  //If you're running your app on localhost (HTTP), cookies won’t be sent.
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


    //https://blog.logrocket.com/using-helmet-node-js-secure-application/

    //APIs developed in Express do not involve security HTTP headers. So, default Express apps come with some security concerns.

    //Without Helmet, default headers returned by Express expose sensitive information and make your Node.js app vulnerable 
    //to malicious actors. In contrast, using Helmet in Node.js protects your application from XSS attacks, 
    // Content Security Policy vulnerabilities, and other security issues.