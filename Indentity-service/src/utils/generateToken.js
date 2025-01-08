import jwt from "jsonwebtoken";


const generateTokens = (user)=>{
   
    const accesstoken = jwt.sign({
        userId:user._id,
    },process.env.JWT_SECRET,{expiresIn:'120m'})


    const refreshtoken = jwt.sign({
        userId:user._id,
    },process.env.REFRESH_TOKEN_SECRET,{expiresIn:"7d"});

    
    return {accesstoken,refreshtoken};
}

export default generateTokens;