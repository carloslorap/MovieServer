import express from 'express';
import { addLikedMovie, changeUserPassword, deleteLikedMovies, deleteUser, deleteUserProfile, getLikedMovies, getUsers, loginUser, registerUser,updateUserProfile } from '../Controllers/UserController.js';
import { admin, protect } from '../middlewares/Auth.js';

const router = express.Router();

router.post("/", registerUser);
router.post("/login", loginUser);


router.put("/",protect,updateUserProfile);
router.delete("/deleteuser",protect,deleteUserProfile);
router.put("/password",protect,changeUserPassword);
router.get("/favorites",protect,getLikedMovies);
router.post("/favorites",protect,addLikedMovie);
router.delete("/favorites",protect,deleteLikedMovies);


////////////******ADMIN (ROUTES) ******//////////////////////////
router.get("/",protect,admin,getUsers);
router.delete("/:id",protect,admin,deleteUser);


export default router;