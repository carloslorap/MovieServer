import express from 'express';
import { admin, protect } from '../middlewares/Auth.js';
import { createMovie, createMovieReview, deleteAllMovie, deleteMovie, getMovieByID, getMovies, getRandomMovies, getTopRatedMovie, importMovies, updateMovie } from '../Controllers/MoviesController.js';

const router = express.Router();

router.post("/import", importMovies);
router.get("/", getMovies);
router.get("/:id", getMovieByID);
router.get("/rated/top", getTopRatedMovie);
router.get("/random/all", getRandomMovies); 


router.post("/:id/reviews", protect,createMovieReview);


////////////******ADMIN (ROUTES) ******//////////////////////////
router.put("/:id", protect , admin , updateMovie);
router.delete("/:id", protect , admin , deleteMovie);
router.delete("/", protect , admin , deleteAllMovie);
router.post("/", protect , admin , createMovie);


export default router;