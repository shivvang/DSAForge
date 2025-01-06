import mongoose  from "mongoose";

const refreshtokenSchema = new mongoose.Schema({
    token:{
        type: String,
        required: true,
        unique: true,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref : "User",
        required: true,
    },
    expiresIn:{
        type: Date,
        required: true,
    }
},{timestamps:true});


//The index on expiresIn ensures that MongoDB automatically removes expired refresh tokens from the database

// fieldName: 1 → Specifies the field to index (1 means ascending order). In your case, it's expiresIn.

// expiresAfterSeconds: 0 → Tells MongoDB to automatically delete documents when the value in expiresIn has passed.

refreshtokenSchema.index({expiresIn:1},{expiresAfterSeconds:0});

const RefreshToken = mongoose.model("RefreshToken",refreshtokenSchema);

export default RefreshToken;
