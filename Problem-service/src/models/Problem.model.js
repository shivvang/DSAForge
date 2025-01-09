import mongoose from "mongoose";

const ProblemSchema = new mongoose.Schema({
 title:{
    type:String,
    required:true,
 },
 description:{
    type:String,
    required:true,
 },
 datastructure:{
    type:String,
 },
 algorithm:{
    type:String,
 },
 sourcelink:{
    type:String,
    required:true,
 },
 notes:{
    type:String,
 },
 user:{
    type:mongoose.Schema.Types.ObjectId, //from identity service user id
    ref:"User",
    required:true,
 },
},{
    timestamps:true,
});

const Problem = mongoose.model("Problem",ProblemSchema);

export default Problem;