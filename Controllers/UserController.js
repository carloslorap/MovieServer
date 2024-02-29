import asyncHandler from "express-async-handler";
import User from "../Models/UserModels.js";
import bcrypt from 'bcryptjs'
import { generateToken } from "../middlewares/Auth.js";

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password, image } = req.body;
  try {
    const userExists = await User.findOne({ email });

    // verificar si el usuario existe
    if (userExists) {
        res.status(400)
        throw new Error("User already exists");
    } 
    // hash password
    const salt = await bcrypt.genSalt(10); 
    const hanshedPassword = await bcrypt.hash(password,salt); 

    //crear usuario en BD
    const user = await User.create({
      fullName,
      email,
      password:hanshedPassword,
      image
    });

    // si el usuario se creó correctamente, envíe los datos del usuario y el token al cliente
    if (user) {
     res.status(201).json({
      _id:user._id,
      fullName:user.fullName,
      email:user.email,
      image:user.image,
      isAdmin:user.isAdmin, 
      token: generateToken(user._id),  
    }) 
    } else {  
        res.status(404);
        throw new Error("Invalid user data")
    } 


  } catch (error) {
    res.status(400).json({message: error.message}); 
  }
});


const loginUser = asyncHandler(async(req,res)=>{
  const {email,password} =req.body;
  try {

    const user =await User.findOne({email});

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id:user._id,
        fullName:user.fullName,
        email:user.email,
        image:user.image,
        isAdmin:user.isAdmin,
        token:generateToken(user._id),
  
  
      })
    } else {
      res.status(401);
      throw new Error('Invalid email or password')
    }
    
  } catch (error) {
    res.status(400).json({message: error.message}); 
  }
  
})


const updateUserProfile = asyncHandler(async(req,res)=>{
  const {fullName,email,image} =req.body;
  try {
    const user =await User.findById(req.user._id);

    if (user) {
      user.fullName =fullName || user.fullName;
      user.email = email || user.email;
      user.image = image || user.image;

      const updatedUser = await user.save();

      res.json({
        _id:updatedUser._id,
        fullName:updatedUser.fullName,
        email:updatedUser.email,
        image:updatedUser.image,
        isAdmin:updatedUser.isAdmin,
        token:generateToken(updatedUser._id)
      })
    } else{
      res.status(404);
      throw new Error('User not found')
    }



  } catch (error) {
    res.status(400).json({message: error.message}); 
  }
})



const deleteUserProfile = asyncHandler(async(req,res)=>{
  try {

    //buscar usuario en la base de datos
    const user= await User.findById(req.user._id);
    // si el usuario existe, elimine el usuario de la base de datos
    if (user) {
        //si el usuario es administrador lanza un mensaje de error
        if (user.isAdmin){
          res.status(400);
          throw new Error("can't delete admin user")
        }

        // de lo contrario, eliminar el usuario de la base de datos
        await user.deleteOne();
        res.json({ message:"User deleted successfully" });

    }
    else{
      res.status(404);
      throw new Error("user not found");

    }
    
  } catch (error) {
    res.status(400).json({message: error.message}); 
  }
});



const changeUserPassword =asyncHandler(async(req,res)=>{
  const {oldPassword, newPassword} = req.body;

  try {
    //find user in DB
    const user = await User.findById(req.user._id);

    //si el usuario existe, compare la contraseña anterior con la contraseña cifrada, actualice 
    //la contraseña del usuario y guárdela en la base de datos
    if (user && (await bcrypt.compare(oldPassword,user.password))) {
        const salt = await bcrypt.genSalt(10);
        const hanshedPassword =await bcrypt.hash(newPassword, salt);
        user.password= hanshedPassword;
        await user.save();
        res.json({message: 'Password changed'});
    }
    //else send error message
    else{
      res.status(401);
      throw new Error("Invalid old password");
    }
  } catch (error) {
    res.status(400).json({message: error.message}); 
  }
})


const getLikedMovies =asyncHandler(async(req,res)=>{
  try {
    // find user in DB
    const user = await User.findById(req.user._id).populate("linkedMovies");
    //if user exists send liked movies to client
    if (user) {
        res.json(user.linkedMovies)
    }
    else{
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    res.status(400).json({message: error.message}); 
  }
})


const addLikedMovie =asyncHandler(async(req,res)=>{
  const {movieId} =req.body;
  try {
    const user =await User.findById(req.user._id);
    //if user exists add movie to liked movies and save it in DB
    if (user) {
      //check if movie already liked
      //if movie already liked send error message
      if (user.linkedMovies.includes(movieId)) {
        res.status(400);
        throw new Error("Movie already liked");
      }
      //else add movie to liked movies and save it in DB
      user.linkedMovies.push(movieId);
      await user.save();
      res.json(user.linkedMovies)
    }
    else{
      res.status(404);
      throw new Error("Movie not found");
    }
  } catch (error) {
    res.status(400).json({message: error.message}); 
  }
})


const deleteLikedMovies =asyncHandler(async(req,res)=>{
  try {
    const user =await User.findById(req.user._id);
    if (user) {
        user.linkedMovies =[];
        await user.save();
        res.json({message:"All liked movies deleted successfully"})
    }
    else {
      res.status(404);
      throw new Error("Movie not found");
    }
  } catch (error) {
    res.status(400).json({message: error.message}); 
  }
})





////////////******ADMIN (START) ******//////////////////////////

const getUsers =asyncHandler(async(req,res)=>{
  try {
      //find all users in DB
      const users =await User.find({});
      res.json(users);

  } catch (error) {
    res.status(400).json({message: error.message}); 
  }
})


const deleteUser =asyncHandler(async(req,res) =>{
  try {
    //find user in DB
    const user =await User.findById(req.params.id);
    //if user exists, delete user from DB
    if (user) {
      //if user is admin throw error message
      if (user.isAdmin) {
        res.status(400);
        throw new Error("Cant delete admin user");
      }
      await user.deleteOne();
      res.json({message:"User deleted successfully"})
    }
    else{
      res.status(404);
      throw new Error("User not found");
      
    }
    
  } catch (error) {
    res.status(400).json({message: error.message}); 
  }
})

////////////******ADMIN (END) ******//////////////////////////

export {registerUser,loginUser,updateUserProfile,deleteUserProfile,changeUserPassword,getLikedMovies,addLikedMovie,deleteLikedMovies,getUsers,deleteUser}; 
 