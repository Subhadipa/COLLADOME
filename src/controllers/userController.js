const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt=require("jsonwebtoken")
const JWT_SECRET=process.env.JWT_SECRET
const nodemailer = require("nodemailer");
const exportFunction = {
  createUser: async (req, res) => {
    try {
      let userDetails = req.body;
      const saltRounds = 10;
      const emailCheck=await userModel.findOne({email:userDetails.email})
      if(emailCheck){
        return res.status(400).send({status:false,message:"User with the email already exist!"});
      }
      const hasedPassword = await bcrypt.hash(userDetails.password, saltRounds);
      const userData = await userModel.create({...userDetails,password: hasedPassword});
      return res.status(200).send({status: true,message: "New user created successfully!",data: userData});
     
    } catch (error) {
      return res.status(500).send({ status: false, message: error.message });
    }
  },
  loginUser:async(req,res)=>{
    try{
    let {email,password}=req.body
    const userCheck=await userModel.findOne({email})
    if(!userCheck){
      return res.status(400).send({status:false,message:"No user exist with this email!"});
    }else{
        let passwordCheck=await bcrypt.compare(password,userCheck.password)
        if(passwordCheck){
            let generatedToken=jwt.sign({userId:userCheck._id},JWT_SECRET,{expiresIn:'1d'});
            let oldTokens=userCheck.tokens||[]
            if(oldTokens.length){

              oldTokens=oldTokens.filter(t=>{
                const timeDiff=(Date.now()-parseInt(t.signedAt))/1000
                if(timeDiff<86400)
                  return t
              })
            
            }
            await userModel.findByIdAndUpdate(userCheck._id,{tokens:[...oldTokens,{token:generatedToken,signedAt:Date.now().toString()}]})
            return res.status(200).send(
                {
                    status:true,
                    message:`${userCheck.fname} ${userCheck.lname} logged in successfully!`,
                    userId:userCheck._id,
                    token:generatedToken
                
                })
        }else{
            return res.status(400).send({status:false,message:"Invalid credentials!"});
        }
    }
  }catch(error){
    return res.status(500).send({ status: false, message: error.message });
  }
  },
  logoutUser:async(req,res)=>{
    try{
        if(req.headers && req.headers.authorization){
          const token=req.headers.authorization
          if(!token){
            return res.status(401).send({status:false,message:"Authorization falied!"})
          }
          let tokens=req.user.tokens
          const newTokens=tokens.filter(t=>t.token!==token)
          await userModel.findByIdAndUpdate(req.user._id,{tokens:newTokens})
          return res.status(200).send({status:true,message:`${req.user.fname} ${req.user.lname} logged out successfully!`})

        }
    }catch(error){
    return res.status(500).send({ status: false, message: error.message });
  }
  },
  changePassword:async(req,res)=>{
    try{
    let {old_password,new_password}=req.body
    let saltRounds=10
    let passwordCheck=await bcrypt.compare(old_password,req.user.password)
    if(passwordCheck){
      let hasedPassword=await bcrypt.hash(new_password,saltRounds);
      await userModel.findByIdAndUpdate(req.user._id,{password:hasedPassword})
      return res.status(200).send({status:true,message:"Password changed successfully!"})
    }else{
      return res.status(400).send({status:false,message:"Password does not match!"})
    }
  }catch(error){
    return res.status(500).send({ status: false, message: error.message });
  }
   
  },
  resetPassword : async (req, res) => {
    try{
    let {email}=req.body
    let userData=await userModel.findOne({email})
    if(userData){
    let testAccount = await nodemailer.createTestAccount();
  
    // connect with the smtp
    let transporter = await nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
       secure: false,
       requireTLS: true,
      auth: {
        user: "subhadipatest@gmail.com",
        pass: "dgplyscsovzztzti",
      },
      tls: {
        minVersion: 'TLSv1', // -> This is the line that solved my problem
        rejectUnauthorized: false,
    },
    });
    let currentDateTime=new Date();
    let info = await transporter.sendMail({
      from: '"Subhadipa Banerjee👻" <subhadipatest@gmail.com>',
      to: email, 
      subject: "Password Reset", 
      html: "<h1>Welcome!</h1><p>\
           <h3>Hi "+userData.fname+" "+userData.lname+"</h3>\
           If you have requested to reset your pasword click on the below link<br/>\
           <a href='http://localhost:3000/change-password/"+currentDateTime+"+++"+userData.email+"'>Click on the link\
           </p>" 
    });

    return res.status(200).send({status:true,message:"Email sent successfully!",data:info.messageId});
  }else{
    return res.status(400).send({status:false,message:"Email does not exist!"})
  }
}catch(error){
  return res.status(500).send({ status: false, message: error.message });

}
  
},
  updatePassword:async(req,res)=>{
    try{
    let {new_password}=req.body
    saltRounds=10
    const hasedPassword=await bcrypt.hash(new_password,saltRounds)
    let userData=await userModel.findByIdAndUpdate(req.user._id,{password:hasedPassword})
    return res.status(200).send({status:true,message:"Password updated successfully!"})
    }catch(error){
      return res.status(500).send({ status: false, message: error.message });

    }

  }
};

module.exports = exportFunction;
