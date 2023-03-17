const mongoose=require("mongoose");
const userSchema=new mongoose.Schema({
    
    fname:{
        type:String,
        required:true
    },
    lname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    tokens:[{
        type:Object
    }]
},
{timestamps:true}

)


module.exports=mongoose.model("User Model",userSchema)