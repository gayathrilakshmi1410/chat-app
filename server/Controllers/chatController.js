const chatModel=require("../Models/chatModel")

//createChat
//findUserChats
//findChat

const createChat=async(req,res)=>{
    const {firstId,secondId}=req.body;

    try{
        const chat=await chatModel.findOne({
            members:{$all:[firstId,secondId]},
        })

        if(chat) return res.status(200).json(chat);

        const newChat=new chatModel({
            members:[firstId,secondId]
        })

        const response=await newChat.save()

        res.status(200).json(response);

    }catch(error){
        console.log(error)
        res.status(500),json(error);
    }
    
};

// ✅ Get all chats for a user and exclude chats with deleted users
const findUserChats = async (req, res) => {
  const userId = req.params.userId;

  try {
    // Find all chats that include this user
    let chats = await chatModel
      .find({ members: { $in: [userId] } })
      .populate("members", "-password");

    // ✅ Filter out chats where one or more members are missing (user deleted)
    chats = chats.filter(
      (chat) => chat.members.length === 2 && chat.members.every((m) => m !== null)
    );

    res.status(200).json(chats);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const findChat=async(req,res)=>{
    const {firstId,secondId}=req.params;

    try{
        const chat=await chatModel.find({
           members:{$all:[firstId,secondId]},
        })

        res.status(200).json(chat);
    }catch(error){
          console.log(error)
        res.status(500),json(error);
    }
};

module.exports={createChat,findUserChats,findChat};