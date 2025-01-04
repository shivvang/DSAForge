import passport from "passport";
import LocalStrategy from 'passport-local';
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";

passport.use(new LocalStrategy(
    async function(username, password, done) {
     try {
        const user = await User.findOne({ userName:username} );
      
        if(!user) return done(null,false,{message:"User not found"});

        const isMatch = await bcrypt.compare(password,user.password);

         
        if(isMatch) return done(null,user);

        else return done(null,false,{message:"incorrect password"});
     } catch (error) {
        return done(error);
     }
    }
  ));

  passport.serializeUser((user, done) => {
    done(null, user._id);
});
