import mongoose, { Schema, Document, models } from "mongoose";

const userSchema:Schema=new Schema({
    username:{
        type:String,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        minlength:6,
        maxlength:100
    },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task", 
    }],
})

const User=models?.User || mongoose.model("User",userSchema);

export default User;