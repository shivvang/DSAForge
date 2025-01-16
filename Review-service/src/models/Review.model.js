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

//TTL (time to live) Index deletes documents automatically after nextReviewTime is reached.
ReviewSchema.index({ nextReviewTime: 1 }, { expireAfterSeconds: 0 });

const Review = mongoose.model("Review",ReviewSchema);

export default Review;