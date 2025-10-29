const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // ✅ Must match your user model name
      },
    ],
  },
  { timestamps: true }
);

const chatModel=mongoose.model("Chat",chatSchema);

module.exports=chatModel;
