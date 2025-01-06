import mongoose from "mongoose";
import argon from "argon2";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
    },
    password:{
        type:String,
        required:true,
        unique:true,
        trim:true,
    },
},{timestamps:true});


userSchema.pre("save",async function(next){
    if(this.isModified("password")){
        try {
            this.password = await argon.hash(this.password);
        } catch (error) {
            return next(error);
        }
    }
})

userSchema.methods.comparePassword = async function(userSentPassword) {
    try {
        return await argon.verify(this.password,userSentPassword);
    } catch (error) {
        throw error;
    }
}

userSchema.index({username:"text"});

const User = mongoose.model("User",userSchema);

export default User;