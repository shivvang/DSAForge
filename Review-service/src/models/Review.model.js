import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    problem:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Problem",
        required:true,
    },
    onReview:{
        type:Boolean,
        default:false,
    },
    difficulty:{
        type:String,
        enum:["easy","medium","hard"],
    },
},{timestamps:true});


const Review = mongoose.model("Review",reviewSchema);

export default Review;