const jwt=require("jsonwebtoken")
const userModel = require("../models/userModel");
const JWT_SECRET=process.env.JWT_SECRET
module.exports.authenticate=async(req,res,next)=>{
try{
    let header=req.headers['authorization'];
    if(!header){
        return res.status(401).send({status:false,message:"Mandatory header is missing!"})

    }else{
        let decodedToken=jwt.verify(header,JWT_SECRET);
        const user=await userModel.findById(decodedToken.userId)
        if(!user){
            return res.status(401).send({ status: false, message: "Unauthorize access!" });
        }else{
            req.user=user;
            next();
        }
    }
} catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }

}