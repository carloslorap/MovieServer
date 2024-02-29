import jwt from 'jsonwebtoken';
import User from "../Models/UserModels.js";
import asyncHandler from "express-async-handler";

const generateToken= (id) =>{
    return jwt.sign({id}, process.env.JWT_SECRET,{
        expiresIn:"1d",
    })
} 


// protection middleware
const protect =asyncHandler(async(req,res,next)=>{
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        // establecer el token del token del portador en el encabezado
        try{
            token= req.headers.authorization.split(" ")[1];
            //verificar token y obtener ID de usuario
            const decoded =jwt.verify(token, process.env.JWT_SECRET);
            // obtener la identificación de usuario del token decodificado
            req.user =await User.findById(decoded.id).select("-password");
            next();

        }catch(error){
            console.error(error);
            res.status(401);
            throw new Error("Not authorized no token");
        }
        
    }
})


//admin middleware
const admin =(req,res,next)=>{
 if (req.user && req.user.isAdmin) {
    next();
 }else{
    res.status(401);
    throw new Error("Not authorized as an admin");
 }
}

export {generateToken,protect,admin};