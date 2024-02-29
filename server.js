import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import UserRouter from './Routes/UserRouter.js';
import Movierouter from './Routes/MoviesRouter.js';
import Categorierouter from './Routes/CategoriesRouter.js';
import { errorHandler } from './middlewares/errorMiddleware.js';
import Uploadrouter from './Controllers/UploadFile.js';


dotenv.config();
  
 
const app = express();  
app.use(cors());
app.use(express.json()); 
  
//connect DB
connectDB()   
 
//Main route
app.get('/',(req,res) =>{
    res.send('api is running...')
}) 

// other routes
app.use("/api/users", UserRouter);
app.use("/api/movies", Movierouter);
app.use("/api/categories", Categorierouter);
app.use("/api/upload", Uploadrouter)

//error handling middleware
app.use(errorHandler)



const PORT =process.env.PORT || 5000; 
  
app.listen(PORT,()=>{
    console.log(`Server running in http://localhost/${PORT}`)
})