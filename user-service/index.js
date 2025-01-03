import express from "express";

const app = express();

app.use(express.json())


app.get("/",(req,res,next)=>{
    return res.status(200).json({"msg":"Hello from User service"})
})

app.listen(8001,()=>{
console.log(`listening to port 8001`)
});