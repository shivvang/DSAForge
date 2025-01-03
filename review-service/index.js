import express from "express";

const app = express();

app.use(express.json())

app.get("/", (req, res,next)=>{
    return res.status(200).json({"msg":"Hello from the Review service"})
})

app.listen(8002, () => {
    console.log(`listening to port 8002`);
});