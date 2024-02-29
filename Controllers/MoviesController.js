import asyncHandler from "express-async-handler";
import Movie from "../Models/MoviesModels.js";
import { MoviesData } from "../Data/MovieData.js";

const importMovies = asyncHandler(async (req, res) => {
  //primero nos aseguramos de que nuestra tabla Películas esté vacía eliminando todos los documentos
  await Movie.deleteMany({});
  //luego insertamos todas las películas de Moviesdata
  const movies = await Movie.insertMany(MoviesData);
  res.status(201).json(movies);
});

const getMovies = asyncHandler(async (req, res) => {
  try {
    //filtrar películas por categoría, hora, idioma, rate, año y búsqueda
    const { category, time, language, rate, year, search } = req.query;
    let query = {
      ...(category && { category }),
      ...(time && { time }),
      ...(language && { language }),
      ...(rate && { rate }),
      ...(year && { year }),
      ...(search && { name: { $regex: search, $options: "i" } }),
    };

    //carga más funciones de películas
    const page = Number(req.query.pageNumber) || 1;
    const limit = 4; //limite de peliculas
    const skip = (page - 1) * limit; //saltar la (cantidad) que pusiste de películas por página

    //encontrar películas por consulta, omitir y limitar
    const movies = await Movie.find(query)
      .sort({ createAt: -1 })
      .skip(skip)
      .limit(limit);

    //obtener el número total de películas
    const count = await Movie.countDocuments(query);

    //enviar respuesta con películas y número total de películas

    res.json({
      movies,
      page,
      pages: Math.ceil(count / limit), //total number of pages
      totalMovies: count, //total number of movies
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const getMovieByID = asyncHandler(async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (movie) {
      res.json(movie);
    } else {
      res.status(404);
      throw new Error("Movie not found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const getTopRatedMovie = asyncHandler(async (req, res) => {
  try {
    const movies = await Movie.find({}).sort({ rate: -1 });
    res.json(movies);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const getRandomMovies = asyncHandler(async (req, res) => {
  try {
    const movies = await Movie.aggregate([{ $sample: { size: 8 } }]);
    res.json(movies);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const createMovieReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  try {
    //encontrar película por id en DB
    const movie = await Movie.findById(req.params.id);
    if (movie) {
      //Comprueba si el usuario ya ha revisado esta película
      const alreadyReviewed = movie.reviews.find(
        (r) => r.userId.toString() === req.user._id.toString()
      );
      //si el usuario ya revisó esta película, envíe el error 400
      if (alreadyReviewed) {
        res.status(400);
        throw new Error("Ya has revisado esta película.");
      }
      //else create a new review
      const review = {
        userName: req.user.fullName,
        userId: req.user._id,
        userImage: req.user.image,
        rating: Number(rating),
        comment,
      };
      //empujar la nueva review a la array de reviews
      movie.reviews.push(review);
      //incrementar el número de reseñas
      movie.numberOfReviews = movie.reviews.length;

      //calcular la nueva rate
      movie.rate =
        movie.reviews.reduce((acc, item) => item.rating + acc, 0) /
        movie.reviews.length;

      //guardar la pelicula en la DB
      await movie.save();
      //Enviar la nueva película al cliente
      res.status(201).json({
        message: "Review added",
      });
    } else {
      res.status(404);
      throw new Error("Movie not found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});



////////////******ADMIN (START) ******//////////////////////////
const updateMovie = asyncHandler(async (req, res) => {
  try {
    //get data from request body
    const {
      name,
      desc,
      image,
      titleImage,
      rate,
      numberOfReviews,
      category,
      time,
      language,
      year,
      video,
      casts,
    } = req.body;

    const movie = await Movie.findById(req.params.id);

    if (movie) {
      //update movie data
      movie.name = name || movie.name;
      movie.desc = desc || movie.desc;
      movie.image = image || movie.image;
      movie.titleImage = titleImage || movie.titleImage;
      movie.rate = rate || movie.rate;
      movie.numberOfReviews = numberOfReviews || movie.numberOfReviews;
      movie.category = category || movie.category;
      movie.time = time || movie.time;
      movie.language = language || movie.language;
      movie.year = year || movie.year;
      movie.video = video || movie.video;
      movie.casts = casts || movie.casts;

      //save the movie in DB
      const updatedMovie = await movie.save();

      //send the update movie to the client
      res.status(201).json(updatedMovie);
    } else {
      res.status(404);
      throw new Error("Movie not found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const deleteMovie = asyncHandler(async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    //if the movie is found delete it
    if (movie) {
      await movie.deleteOne();
      res.json({ message: "Movie removed" });
    } else {
      res.status(404);
      throw new Error("Movie not found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


const deleteAllMovie =asyncHandler(async(req, res) => {
  try {
    //delete all movies
    await Movie.deleteMany({});
    res.json({ message: "All Movie removed" });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
})

const createMovie=asyncHandler(async(req, res) => {
  try {
    //get data from request body
    const {
      name,
      desc,
      image,
      titleImage,
      rate,
      numberOfReviews,
      category,
      time,
      language,
      year,
      video,
      casts,
    } = req.body;

    //create Movie
    const movie=new Movie({
      name,
      desc,
      image,
      titleImage,
      rate,
      numberOfReviews,
      category,
      time,
      language,
      year,
      video,
      casts,
      userId:req.user._id
    })

    if (movie) {
      const createdMovie =await movie.save();
      res.status(201).json(createdMovie);
    }
    else{
      res.status(404);
      throw new Error("Invalid movie data");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
})
////////////******ADMIN (END) ******//////////////////////////

export {
  importMovies,
  getMovies,
  getMovieByID,
  getTopRatedMovie,
  getRandomMovies,
  createMovieReview,
  updateMovie,
  deleteMovie,
  deleteAllMovie,
  createMovie,
};
