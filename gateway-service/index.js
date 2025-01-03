import express from "express";
import proxy from "express-http-proxy";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json())

//proxy to user-service
app.use('/user',proxy('http://localhost:8001'));

//proxy to review-service
app.use("/review",proxy('http://localhost:8002'));

//proxy to problem-service
app.use('/',proxy('http://localhost:8003'));

app.listen(8000,()=>{
console.log(`listening to Gateway service on port 8000`)
});