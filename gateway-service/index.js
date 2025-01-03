import express from "express";
import proxy from "express-http-proxy";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json())

//this is what express http proxy does

//Forwards Requests: It sends incoming API requests from one server (Gateway) to another server (Microservices like User, Problem, Review).
//Hides Internal Services: Clients only interact with the Gateway (8000), never seeing 8001, 8002, or 8003.
//Simplifies Routing: You can define routes in the Gateway and let the proxy handle forwarding seamlessly.

//proxy to user-service
app.use('/user',proxy('http://localhost:8001'));

//proxy to review-service
app.use("/reviews",proxy('http://localhost:8002'));

//proxy to problem-service
app.use('/problems',proxy('http://localhost:8003'));

app.listen(8000,()=>{
console.log(`listening to Gateway service on port 8000`)
});