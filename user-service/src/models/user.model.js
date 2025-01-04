import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema({
    userName:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    isMfaActive:{
        type:Boolean,
        required:false
    },
    twoFactorSecret:{
        type:String,
    }
},{
    timestamps:true,
});


// What it does:
// A pre-save hook in Mongoose that runs before saving a user document to the database.

// Why it’s used:
// To ensure that the password is hashed before saving it.

userSchema.pre("save",async function (next){
   

   // Check if the password field is modified
   if (!this.password || !this.isModified("password")) {
       console.log("Password not modified, skipping hashing.");
       return next();
   }

   try {
       this.password = await bcrypt.hash(this.password, 10); // Hash the password
      
       next();
   } catch (err) {
       console.error("Error hashing password:", err);
       next(err); // Pass error to the next middleware
   }


})

const User = mongoose.model("User",userSchema);
export default User;