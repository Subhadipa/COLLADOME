const eventModel=require("../models/eventModel")
const userModel = require("../models/userModel")


const exportFunction = {
   createEvent:async(req,res)=>{
    try{
    let eventDetails=req.body
    let InviteList={
        eventDetails:null,
        guestDetails:null
    }
    let eventData=await eventModel.create({...eventDetails,createdBy:req.user._id,InviteList})
    return res.status(200).send({status:true,message:"Event created successfully!",data:eventData})
    }catch(error){
        return res.status(500).send({ status: false, message: error.message });
    }

   },
   createInviteList:async(req,res)=>{
    try{
        let {invitingUserId,invitingEventId}=req.body
        let userDetails=await userModel.find({_id:invitingUserId})
        let userArr=[]
        for(let i=0;i<userDetails.length;i++){
            userArr.push(userDetails[i]._id)
        }

       let eventDetails=await eventModel.findById(invitingEventId)
       if(userDetails && eventDetails){
            eventDetails.InviteList= { eventDetails: eventDetails._id, guestDetails: userArr }
            eventDetails.save()
            //eventModel.find().limit(1)
            return res.status(200).send({status:true,message:"Invite list created successfully!",data:eventDetails})

        }else{
            return res.status(400).send({ status: false, message: "Either user or event doesn't exist" });
        }
    }catch(error){
        return res.status(500).send({ status: false, message: error.message });
    }
   },

 getEventDetails:async (req,res)=>{
    try{
    let eventDetails=await eventModel.find({createdBy:req.user._id})
    return res.status(200).send({status:true,message:"Event details fetched successfully!",data:eventDetails})
   }catch(error){
    return res.status(500).send({ status: false, message: error.message });
   }
 },
 updateEventDetails:async (req,res)=>{
    try{
        let {title,description}=req.body
        let eventId=req.params.eventId
      
       let userCheck =await eventModel.find({createdBy:req.user._id})
       if(userCheck.length>0){
        let eventDetails=await eventModel.findByIdAndUpdate(eventId,{title,description},{new:true})
        return res.status(200).send({status:true,message:"Event details updated successfully!",data:eventDetails})
       }else{
        return res.status(401).send({status:false,message:"You are not authorize to update the event"})
       }

   
   }catch(error){
    return res.status(500).send({ status: false, message: error.message });
   }
 },


}

module.exports=exportFunction