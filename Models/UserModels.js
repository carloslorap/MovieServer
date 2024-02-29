import mongoose from "mongoose";

const UserSchema =mongoose.Schema({
    fullName:{
        type:String,
        required:[true,"please add a full name"]
    },
    email:{
        type:String,
        required:[true,"please add a email"],
        unique:true,
        trim:true,
    },
    password:{
        type:String,
        required:[true,"please add a password"],
        minLength:[6, "Password must be at least 6 characters"],
    },
    image:{
        type:String,
    },
    isAdmin:{
        type:Boolean,
        default:false,
    },
    linkedMovies:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Movie",
        },
    ]
},
{
    timestamps:true,
}
); 
export default mongoose.model("User",UserSchema);