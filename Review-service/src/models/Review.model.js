import mongoose from "mongoose";


const ReviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    problem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Problem",
        required: true,
    },
    isReviewed: {
        type: Boolean,
        default: false,
    },
    difficulty: {
        type: String,
        enum: ["easy", "medium", "hard"],
    },
    nextReviewTime: {
        type: Date,
        required: true, 
    },
});


const Review = mongoose.model("Review",ReviewSchema);

export default Review;