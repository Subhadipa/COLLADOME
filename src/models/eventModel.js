const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;
let eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    createdBy: {
      type: ObjectId,
      ref: "User Model",
      required: true,
    },
    InviteList:{
        eventDetails:{
        type: ObjectId,
        ref: "Event Model"
    },
    guestDetails:{
        type: [ObjectId],
        ref: "User Model"
    }
}
   
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event Model", eventSchema);
