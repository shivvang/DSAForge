import express from "express";

const app = express();

app.use(express.json());

app.get("/",(req,res,next)=>{
    return res.status(200).send({"msg":"Hello from Problem service"});
})

app.listen(8003, () => {
    console.log(`listening to port 8003`);
})