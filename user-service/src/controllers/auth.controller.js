import User from "../models/user.model.js";

export const registerUser =async(req,res)=>{
    try {
        const {userName,password}=req.body;

        

        //check whether req body has values in it or not
        if([userName,password].some((field)=>field?.trim ==="")) return res.status(400).json({message:"The client sent invalid or incomplete data"});

       

        const isExistingUSer = await User.findOne({userName});
       
        

        //check whether user exist already or not
        if(isExistingUSer) return res.status(409).json({message:`Username ${userName} exists in the database.`})

           

        const newUser = new User({
           userName,
           password,
           isMfaActive:false,
        });

        
       
        await newUser.save();

        
          return res.status(201).json({ 
            message: "User registered successfully", 
            user: { id: newUser._id, userName: newUser.userName } 
        });

    } catch (error) {
        res.status(500).json({error:"Error registering user",message:error});
    }
}


export const loginUser =async(req,res)=>{
    console.log("req user",req.user);
    return res.status(201).json({ 
        message: "User logged in  successfully", 
        user: { id: req.user._id, userName: req.user.userName ,isMfaActive:req.user.isMfaActive} 
    });
}
export const authStatus =async()=>{}
export const logoutUser =async()=>{}
export const setup2fa =async()=>{}
export const verify2fa =async()=>{}
export const reset2fa =async()=>{}