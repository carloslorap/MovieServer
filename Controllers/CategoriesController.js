import asyncHandler from "express-async-handler";
import Categories from "../Models/CategoriesModels.js";


const getCategories =asyncHandler(async(req,res)=>{
    try {
        //find all categories in DB
        const categories =await Categories.find({});

        res.json(categories)
    } catch (error) {
        res.status(400).json({message:error.message});
    }
});

////////////******ADMIN (START) ******//////////////////////////
const createCategory =asyncHandler(async(req,res)=>{
    try {
        //get title from request body
        const { title } = req.body;

        //create new category
        const category =new Categories({
            title,
        });

        //save the category in DB
        const createdCategory =await category.save();

        //send the new category to the client
        res.status(201).json(createdCategory)
    } catch (error) {
        res.status(400).json({message:error.message});
    }
});


const updateCategory =asyncHandler(async(req,res)=>{
    try {
        //get category id from request params
        const category=await Categories.findById(req.params.id);

        if (category) {
            //update category title
            category.title =req.body.title || category.title;

            //save the updated category in DB
            const updatedCategory =await category.save();

            //send the update category to the client
            res.status(201).json(updatedCategory);
        }else{
            res.status(404).json({message:"Category not found"});
        }
    } catch (error) {
        res.status(400).json({message:error.message});
    }
});


const deleteCategory = asyncHandler(async(req,res)=>{
    try {
        const category =await Categories.findById(req.params.id);

        if (category) {
            //delete the category from DB
            await category.deleteOne();

            res.json({message:"category deleted"});
        }else{
            res.status(404).json({message:"Category not found"});
        }
    } catch (error) {
        res.status(400).json({message:error.message});
    }
});

////////////******ADMIN (END) ******//////////////////////////


export {getCategories,createCategory,deleteCategory,updateCategory}